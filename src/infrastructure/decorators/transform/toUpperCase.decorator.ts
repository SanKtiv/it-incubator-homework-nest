import { Transform, TransformFnParams } from 'class-transformer';
import {every} from "rxjs/operators";

// Custom decorator (в библиотеке class-transformer по умолчанию нету декоратора trim)
// не забываем установить transform: true в глобальном ValidationPipe
export const ToUpperCase = () =>
  Transform(({ value }: TransformFnParams) => {
    if (value && typeof value === 'string') return value.toUpperCase();
  });

export const ToUpperCaseSort = () =>
    Transform(({ value }: TransformFnParams) => {
        if (value) {
            if (typeof value === 'string') return value.toUpperCase();
            if (Array.isArray(value) && value.every(e => typeof e === 'string')) {
                return value.map(e => e.split(" ")[1].toUpperCase())
            }
        }
    });