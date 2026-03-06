export interface PaymentConfirmedEvent{
    orderId: string;
    userId: string;
    amount: number;
    status: string;
}