import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {ErrorsFilter} from "./infrastructure/filters/exception.filter";
import {throws} from "assert";

const port = process.env.PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe(
        {
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errorsArray) => {
                // const eArray = errorsArray.map(e => {
                //     const keysErrors = Object.keys(e.constraints)
                //
                // })
                // const fields = errorsArray.forEach(e => e.property)
                //errorsArray.forEach(e => arr.push(Object.keys(e.constraints)[0]))
                throw new BadRequestException([1,2,3,4])
            }
        }));
    app.useGlobalFilters(new ErrorsFilter())
    await app.listen(port);
}

bootstrap();
