import { Transform, TransformFnParams } from 'class-transformer';

// Custom decorator (в библиотеке class-transformer по умолчанию нету декоратора trim)
// не забываем установить transform: true в глобальном ValidationPipe
export const ToUpperCase = () =>
  Transform(({ value }: TransformFnParams) => {
    if (value && typeof value === 'string') return value.toUpperCase();
  });

export const ToUpperCaseSort = () =>
    Transform(({ value }: TransformFnParams) => {
        const str = (e: string): string => {
            const arr = e.split(" ");

            arr[1] = arr[1].toUpperCase();

            return arr.join(" ")
        }

        if (value) {
            if (typeof value === 'string') return str(value)

            if (Array.isArray(value) && value.every(e => typeof e === 'string'))
                return value.map(str)
        }
    });