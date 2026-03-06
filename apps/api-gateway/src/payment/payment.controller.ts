import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentDto } from "y/common/dto/payment/createPayment.dto";

@Controller('payment')
export class PaymentController{
    constructor(private readonly paymentService: PaymentService){}

  
  @Post('registerPayment')
  register(@Body() dto: PaymentDto){
    return this.paymentService.register(dto)
    
  }}