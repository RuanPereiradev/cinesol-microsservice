import { NestFactory } from '@nestjs/core';
import { CatalogServiceModule } from './catalog-service.module';
import { SERVICES_PORTS } from 'y/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);

   app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true, 
        forbidNonWhitelisted: true,
      }),
    );
  await app.listen(SERVICES_PORTS.CATALOG_SERVICE);
  console.log(`Catalog Service is running on port ${SERVICES_PORTS.CATALOG_SERVICE}`)
}
bootstrap();
