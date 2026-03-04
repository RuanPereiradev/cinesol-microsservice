import { OrderStatus } from "@prisma/client";
import { Booking } from "apps/booking-service/src/domain/entities/booking";
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { PaymentMethod } from "y/common/entities/payment.entity";

export class PaymentDto {
    @IsUUID() // Garante que é um ID válido
    @IsNotEmpty()
    orderId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsEnum(['PIX', 'CREDIT_CARD'], { message: 'Método de pagamento inválido' })
    method: 'PIX' | 'CREDIT_CARD';

    @IsNumber()
    amount: number;
}