import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICES_PORTS } from 'y/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices'; // Adicione este import

async function bootstrap() {
  // 1. Cria a aplicação base (HTTP)
  const app = await NestFactory.create(NotificationServiceModule);

  // 2. Conecta o "ouvido" do Kafka (Microservice)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Verifique se o seu Kafka está nessa porta
      },
      consumer: {
        groupId: 'notification-consumer-group', // Nome único para este serviço
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, 
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Inicia os Microservices conectados
  await app.startAllMicroservices();

  // 4. Inicia o servidor HTTP
  await app.listen(SERVICES_PORTS.NOTIFICATION_SERVICE);
  
  console.log(`Notification Service (HTTP) running on port ${SERVICES_PORTS.NOTIFICATION_SERVICE}`);
  console.log(`Notification Service (KAFKA) is now listening for events...`);
}
bootstrap();