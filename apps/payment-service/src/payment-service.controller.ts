import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { PaymentDto } from 'y/common/dto/payment/createPayment.dto';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @Get()
  getHello(): string {
    return this.paymentServiceService.getHello();
  }
  
  @Post('registerPayment')
  register(@Body() dto: PaymentDto){
    return this.paymentServiceService.registerPayment(dto)
    
  }
}
