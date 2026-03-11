import { Injectable } from '@nestjs/common';
import { IUser } from 'y/common';
import { orderCreated } from 'y/common/interfaces/orderCreated.interface';
import { PaymentConfirmedEvent } from 'y/common/interfaces/paymentConfirmedEvent.interface';

@Injectable()
export class NotificationServiceService {
    sendEmail(data: PaymentConfirmedEvent){
      const message = `Olá ${data.name}, seu pagamento de R$ ${data.amount} foi confirmado com sucesso`
      console.log(`[SIMULAÇÃO EMAIL]: ${message}`);
    }

    sendBookingEmail(data: orderCreated){
      const message = `Olá ${data.userId}, seu pedido foi confirmado, você tem 10 minutos para pagar`
      console.log(`[SIMULAÇÃO EMAIL]: ${message}`)
    }

    sendUserEmail(data: IUser){
      const message = `Olá ${data.name}, cadastro feito com sucesso, agora faça o login para receber o token de autenticação`
      console.log(`[SIMULAÇÃO EMAIL]: ${message}`)
    }

}
