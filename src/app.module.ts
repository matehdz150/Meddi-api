import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ //configuracion para poder usar .env en todo el proyecto
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''), //conexion a mongo
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
