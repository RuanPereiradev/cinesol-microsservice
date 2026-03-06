import { Injectable } from '@nestjs/common';
import { PaymentConfirmedEvent } from 'y/common/interfaces/paymentConfirmedEvent.interface';

@Injectable()
export class NotificationServiceService {
    sendEmail(data: PaymentConfirmedEvent){
      const message = `Olá ${data.orderId}, seu pagamento de R$ ${data.amount} foi confirmado com sucesso`
      console.log(`[SIMULAÇÃO EMAIL]: ${message}`);
    }
}
