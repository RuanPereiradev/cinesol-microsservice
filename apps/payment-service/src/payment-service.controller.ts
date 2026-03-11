import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { PaymentDto } from 'y/common/dto/payment/createPayment.dto';
import { JwtAuthGuard } from 'y/common/guards/jwtAuthGuards';
import { CurrentUser } from 'y/common/decorators/current-user.decorator';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @Get()
  getHello(): string {
    return this.paymentServiceService.getHello();
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('registerPayment')
  async register(
    @Body() dto: Omit<PaymentDto, 'userId'>, 
    @CurrentUser() user: any
){
    console.log("Usuário logado:", user);

    const requestWithUser = {
      ...dto,
      userId: user.sub || user.userId || user.id
    }

    console.log(user.sub)
    const result = await this.paymentServiceService.registerPayment(requestWithUser)

    if(!result){
      throw new HttpException({
          message: console.log('erro'),
          statusCode: HttpStatus.BAD_REQUEST,  
      }, HttpStatus.BAD_REQUEST);
    }
    return {
      message: "Pagamento realizado com sucesso",
      data: result.status
    }
  }
}
