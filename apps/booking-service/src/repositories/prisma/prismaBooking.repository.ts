import { DatabaseService } from "y/database";
import { IBookingRepository } from "../interfaces/ibooking.repository";
import { Booking } from "../../domain/entities/booking";
import { Ticket } from "../../domain/entities/ticket";
import { BookingProducts } from "../../domain/entities/bookingProducts";
import { SeatLocks } from "../../domain/entities/seatLocks";
import { Result } from "y/common/env/result";
import { OrderStatus } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaBookingRepository implements IBookingRepository{
    constructor(private readonly dbService: DatabaseService){}

    async checkAvailability(sessionId: string, seatId: string[]): Promise<boolean> {
        const ticket = await this.dbService.ticket.findFirst({
            where: { sessionId, seatId: { in: seatId } }
        });
        if(ticket) return false;

        const lock = await this.dbService.seatLock.findFirst({
            where: {
                sessionId,
                seatId: { in: seatId },
                expiresAt:{ gt: new Date() }
            }
        });
        return !lock;
    }

    async create(booking: Booking, tickets: Ticket[], products: BookingProducts[], locks: SeatLocks[] ): Promise<Booking>{
        return await this.dbService.$transaction(async (tx) => {
            //Criar a Ordem
            const createdOrder = await tx.order.create({
                data: {
                    user: {
                        connect: {id: booking.userId}
                    },
                    totalPrice: Number(booking.totalPrice) || 0,
                    status: 'PENDING',
                }
            });
            //criar tickets vinculados a Order
            await tx.ticket.createMany({
                data: tickets.map(t => ({
                    orderId: createdOrder.id,
                    sessionId: t.sessionId,
                    seatId: t.seatId,
                    price: t.finalPrice,
                    type: t.type
                }))
            });
            //criar os itens de produto se houver
            if(products && products.length > 0){
                await tx.orderItem.createMany({
                    data: products.map(p => ({
                        orderId: createdOrder.id,
                        productId: p.productId,
                        quantity: p.quantity,
                        unitPrice: p.unitPrice
                    }))
                })
            }
            // 4. Criar os Bloqueios de Assento (SeatLocks)
            await tx.seatLock.createMany({
                data: locks.map(l => ({
                    userId: l.userId,
                    sessionId: l.sessionId,
                    seatId: l.seatId,
                    expiresAt: l.expiresAt
                }))
            });

            return new Booking(
                createdOrder.userId,
                booking.sessionId,
                booking.seatIds,
                createdOrder.totalPrice,
                booking.expiresAt,
                createdOrder.id
            )
        })
    }

    async findById(id: string): Promise<Booking | null> {
        // 1. Buscamos a Order no Prisma incluindo os Tickets vinculados
        // Se você tiver produtos, pode incluir 'orderItems' também
        const order = await this.dbService.order.findUnique({
            where: { id },
            include: { 
                tickets: true,
                items: true 
            },
        });

        // 2. Se não encontrar, retornamos null (respeitando a interface)
        if (!order) {
            return null;
        }

        // 3. Extraímos os IDs dos assentos dos tickets para a nossa entidade
        const seatIds = order.tickets.map(t => t.seatId);

        // 4. Pegamos o sessionId do primeiro ticket (já que todos pertencem à mesma sessão)
        const sessionId = order.tickets[0]?.sessionId || "";

        // 5. Reconstituímos a Entidade de Domínio 'Booking'
        // Passamos os dados do banco de volta para o construtor da classe que você criou
        return new Booking(
            order.userId,
            sessionId,
            seatIds,
            order.totalPrice, // Converte Decimal do Prisma para number se necessário
            new Date(), // Aqui você usaria a data de expiração real se estiver no banco
            order.id
        );
    }
    async findPedingOrders(): Promise<Booking[] | null> {
        const order = await this.dbService.order.findMany({
            where: {status: OrderStatus.PENDING},
            include: {
                tickets: true,
                items: true
            },
        });

        return order.map(order => {
            const seatIds = order.tickets.map(t => t.seatId);
            const sessionId = order.tickets[0]?.sessionId || '';

            return new Booking(
                order.userId,
                sessionId,
                seatIds,
                order.totalPrice, 
                new Date(),
                order.id
            )
        })
    }

    async updateStatus(id: string, status: 'PENDING' | 'PAID' | 'CANCELLED'): Promise<void> {
    await this.dbService.order.update({
        where: { id },
        data: {
            status: status 
        }
    });
}


}