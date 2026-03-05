import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Booking } from 'apps/booking-service/src/domain/entities/booking';
import { PaymentDto } from 'y/common/dto/payment/createPayment.dto';
import { Payment } from 'y/common/entities/payment.entity';
import { DatabaseService } from 'y/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from 'y/kafka';

@Injectable()
export class PaymentServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
      await this.kafkaClient.connect();
  }

  async registerPayment(dto: PaymentDto){
    const orderExist = await this.dbService.order.findFirst({
      where: {id: dto.orderId},
    });

    if(!orderExist) throw new NotFoundException('order not found');

    if(orderExist.status === 'PAID' || orderExist.status === 'CANCELLED'){
      throw new UnauthorizedException('order already paid or canceled');
    }

    return  await this.dbService.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          orderId: dto.orderId,
          method: dto.method,
          amount: dto.amount,
          status: 'PAID'
        }
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: {status: 'PAID'}
      })
  
      this.kafkaClient.emit(KAFKA_TOPICS.PAYMENT_COMPLETED, {
        orderId: dto.orderId,
        userId: dto.userId,
        amount: dto.amount
      });

      return newPayment;
    })
  }
}