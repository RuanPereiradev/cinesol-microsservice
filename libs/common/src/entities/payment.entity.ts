import { OrderStatus } from "@prisma/client";
import { AuditableEntity } from "./auditableEntity";
import { Booking } from "apps/booking-service/src/domain/entities/booking";

export enum PaymentMethod{
    CREDIT_CARD = 'CREDIT_CARD',
    PIX = 'PIX'
}

export class Payment extends AuditableEntity {
    id?: string;
    method: PaymentMethod;
    status: OrderStatus;
    amount: number;
    orderId: string;
    orderdata?: any;

    constructor(props: Partial<Payment>){
        super();
        this.id = props.id;
        this.method = props.method!;
        this.status = props.status??'PENDING';
        this.amount = props.amount!;
        this.orderId = props.orderId!;
    }


}