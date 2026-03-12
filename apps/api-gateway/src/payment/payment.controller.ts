import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentDto } from "y/common/dto/payment/createPayment.dto";
import { JwtAuthGuard } from "y/common/guards/jwtAuthGuards";
import { CurrentUser } from "y/common/decorators/current-user.decorator";

@Controller('payment')
export class PaymentController{
    constructor(private readonly paymentService: PaymentService){}

  @UseGuards(JwtAuthGuard)
  @Post('registerPayment')
  async register(
    @Body() dto: Omit<PaymentDto, 'userId'>, 
    @CurrentUser() user: any,
    @Req() req: Request
  ){
    const token = req.headers['authorization']; // Aqui está o "Bearer eyJ..."
    const requestWithUser = {
      ...dto,
      userId: user.sub || user.userId || user.id
    }

    return await this.paymentService.register(requestWithUser, token)
    
  }
}