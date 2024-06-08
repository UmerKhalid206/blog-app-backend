import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        // console.log(request.user);
        const user = request.user;
        // console.log("eewfwff",user)
        console.log('User Roles:', user.role);
        // const a = roles.includes(user.role)
        // console.log("sdfdfdfdfdfdf",a)
        return roles.includes(user.role); // Change here to use user.roles instead of user.role
    }
}