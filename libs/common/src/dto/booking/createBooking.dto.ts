import * as ticket from "apps/booking-service/src/domain/entities/ticket";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
    @IsString()
    userId: string;

    @IsString()
    sessionId: string;

    @IsArray({ message: 'seatIds deve ser um array de strings' })
    @IsString({ each: true, message: 'Cada seatId dentro do array deve ser uma string' })
    @IsNotEmpty({ each: true })
    seatIds: string[];

    @IsEnum(['MEIA', 'INTEIRA'])
    ticketType: ticket.TicketType;

    @IsNumber()
    basePrice: number;

    @IsOptional()
    @IsArray()
    products?: {productId: string; quantity: number; unitPrice: number }[];

}