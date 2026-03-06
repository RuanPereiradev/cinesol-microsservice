import { HttpService } from "@nestjs/axios";
import { SERVICES_PORTS } from "y/common";
import { PaymentConfirmedEvent } from "y/common/interfaces/paymentConfirmedEvent.interface";

export class NotificationService {
    private readonly notificationServiceUrl = `http://localhost:${SERVICES_PORTS.NOTIFICATION_SERVICE}`;

    constructor(private readonly httpService: HttpService){console.log('Catalog URL Target:', this.notificationServiceUrl);}

    async sendEmail(data: PaymentConfirmedEvent){
        const message = `Olá ${data.orderId}, seu pagamento de R$ ${data.amount} foi confirmado com sucesso`
        console.log(`[SIMULAÇÃO EMAIL]: ${message}`);
    }
}