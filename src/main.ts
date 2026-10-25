import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import session from 'express-session';

function collect(
  errors: ValidationError[],
  prefix = '',
  result: Record<string, string[]> = {},
) {
  for (const e of errors) {
    const path = prefix ? `${prefix}.${e.property}` : e.property;
    if (e.constraints) {
      result[path] = Object.values(e.constraints);
    }
    if (e.children?.length) {
      collect(e.children, path, result);
    }
  }
  return result;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          message: 'Validation failed',
          errors: collect(errors),
        });
      },
    }),
  );
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 8000);
}
await bootstrap();
