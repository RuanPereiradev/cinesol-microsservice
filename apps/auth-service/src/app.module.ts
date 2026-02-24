import { Module } from '@nestjs/common';
import { AuthServiceModule } from './auth-service.module';
import { DatabaseModule } from 'y/database';

@Module({
  imports: [DatabaseModule, AuthServiceModule],
})
export class AppModule {}