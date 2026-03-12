import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "apps/auth-service/src/jwt.strategy";

@Module({
  imports: [HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret'
    })
  ],
  providers: [PaymentService,
    JwtStrategy
  ],
  controllers: [PaymentController]
})
export class PaymentModule {}
