import { Result } from "y/common/env/result";
import { Booking } from "../domain/entities/booking";
import { Inject } from "@nestjs/common";
import { KAFKA_SERVICE, KAFKA_TOPICS } from "y/kafka";
import { ClientKafka } from "@nestjs/microservices";
import { Ticket, TicketType } from "../domain/entities/ticket";
import { SeatLocks } from "../domain/entities/seatLocks";
import { BookingProducts } from "../domain/entities/bookingProducts";
import { PrismaBookingRepository } from "../repositories/prisma/prismaBooking.repository";

interface CreateBookingRequest {
    userId: string
    sessionId: string
    seatIds: string[]
    ticketType: TicketType
    basePrice: number
    products?: { productId: string; quantity: number; unitPrice: number }[]
}

export class CreateBookingUseCase {
    constructor(
        @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
        @Inject('IBookingRepository') private readonly bookingRepository: PrismaBookingRepository
){}

    async onModuleInit(){
    await this.kafkaClient.connect();
    }

    async execute(request: CreateBookingRequest): Promise <Result<Booking>>{
        try {
            const { userId, sessionId, seatIds,basePrice, ticketType, products } = request;
            //validação de entrada
            if(!userId || !sessionId || !seatIds || seatIds.length === 0){
                return Result.fail<Booking>("Dados de reserva incompletos");
            }

            //verificação de disponibilidade
            const isAvaliable = await this.bookingRepository.checkAvailability(sessionId, seatIds);
            if(!isAvaliable){
                return Result.fail<Booking>("Assentos não disponiveis ou já reservados")
            }
            //cria bloqueios temporários
            const locks = SeatLocks.createBatch(userId, seatIds, sessionId, 10);
            const expiresAt = locks[0].expiresAt;

            //cria ingressos com base na logica inteira/meia
            const ticket = Ticket.createMany(seatIds, sessionId,basePrice, ticketType)

            const productsList = products || []
            //cria os produtos da bomboniere(loja)
            const bookingProducts = productsList?.map(p => 
                new BookingProducts(p.productId, p.quantity, p.unitPrice) ||  []
            )

            //soma de ingressos e produtos
            const totalTickets = ticket.reduce((sum, t) => sum + (t.finalPrice || 0), 0);
            const totalProducts = bookingProducts?.reduce((sum, p) => sum + (p.finalPrice || 0), 0);
            const totalPrice = totalTickets + totalProducts!;

            console.log(`DEBUG: Tickets: ${totalTickets}, Products: ${totalProducts}, Total: ${totalPrice}`);

            //intanciar a entidade principal booking(order)
            const booking = new Booking(userId, sessionId, seatIds, totalPrice, expiresAt);

            //persistir tudo via repositorio
            const savedBooking = await this.bookingRepository.create(
                booking,
                ticket,
                bookingProducts!,
                locks
            );
            //emitir ao kafka
            this.kafkaClient.emit(KAFKA_TOPICS.ORDER_CREATED, {
                bookingId: savedBooking.id,
                userId: savedBooking.userId,
                totalAmount: savedBooking.totalPrice,
                expiresAt: savedBooking.expiresAt
            });
            return Result.ok<Booking>(savedBooking);
        } catch (error){ 
            return Result.fail<Booking>(error.message || "Erro interno ao processar reserve.");
        }
    }
}