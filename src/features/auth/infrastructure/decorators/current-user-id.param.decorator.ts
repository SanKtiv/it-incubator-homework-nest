import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        console.log('req', req.user)
        return req.user.id;
    },
)