import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as paymentConfirmedEventInterface from 'y/common/interfaces/paymentConfirmedEvent.interface';
import * as orderCreatedInterface from 'y/common/interfaces/orderCreated.interface';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}

  @EventPattern('payment.completed')
  async handle(@Payload() data: paymentConfirmedEventInterface.PaymentConfirmedEvent){
    console.log('Evento recebido do Kafka!', data);
    this.notificationServiceService.sendEmail(data)
  }

  @EventPattern('order.created')
  async handleEvent(@Payload() dataOrder: orderCreatedInterface.orderCreated){
    console.log('Evento recebido do kafka!', dataOrder);
    this.notificationServiceService.sendBookingEmail(dataOrder)
  }
}
