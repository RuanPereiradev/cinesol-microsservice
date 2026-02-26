import { Module } from '@nestjs/common';
import { CatalogServiceController } from './catalog-service.controller';
import { CatalogServiceService } from './catalog-service.service';
import { DatabaseModule } from 'y/database';
import { KafkaModule } from 'y/kafka';

@Module({
  imports: [
    KafkaModule.register('catalog-service-group'),
    DatabaseModule
  ],
  controllers: [CatalogServiceController],
  providers: [CatalogServiceService],
})
export class CatalogServiceModule {}
