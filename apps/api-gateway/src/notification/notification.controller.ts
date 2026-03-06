import { Controller } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import * as paymentConfirmedEventInterface from "y/common/interfaces/paymentConfirmedEvent.interface";

@Controller('notification')
export class NotificationController{
  constructor(private readonly notificationService: NotificationService) {}


    @EventPattern('payment confirmed')
      async handle(@Payload() data: paymentConfirmedEventInterface.PaymentConfirmedEvent){
        this.notificationService.sendEmail(data)
      }
}