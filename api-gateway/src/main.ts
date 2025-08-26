import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('HTTP entry point for User and Order microservices')
    .setVersion('1.0')
    .addTag('users')
    .addTag('orders')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Also expose the JSON schema at /api-docs-json
  app.getHttpAdapter().get('/api-docs-json', (req, res) => {
    res.json(document);
  });

  await app.listen(3000);
  console.log('🚪 API Gateway is running on http://localhost:3000');
  console.log('📚 Swagger UI available at http://localhost:3000/api-docs');
  console.log('📄 Swagger JSON available at http://localhost:3000/api-docs-json');
}
bootstrap();
