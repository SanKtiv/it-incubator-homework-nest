import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "../../features/users/application/users.service";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('UserGuard')
        const request = context.switchToHttp().getRequest();
        const id = request.params.id;
        const user = await this.usersService.existUserWithId(id);
        if (!user) throw new NotFoundException();
        return true;
    }
}