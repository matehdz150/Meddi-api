import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Meddi API')
    .setDescription('API documentation for task management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
