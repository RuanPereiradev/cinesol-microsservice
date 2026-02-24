import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios'; // <--- Importe aqui

@Module({
  imports: [HttpModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
