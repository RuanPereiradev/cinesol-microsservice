import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";

@Module({
  imports: [HttpModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
