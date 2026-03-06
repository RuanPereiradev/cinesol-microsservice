export interface PaymentConfirmedEvent{
    name: string;
    orderId: string;
    userId: string;
    amount: number;
    status: string;
}