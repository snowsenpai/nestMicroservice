import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
