import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector //mostrar informacion de los decoradores
  ){

  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard..............')
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())// roles llega del aut que se declaro 
    console.log('META_ROLES: ', META_ROLES);
    console.log('validRoles: ', {validRoles});
    const req = context.switchToHttp().getRequest()
    const user = req.user;

    if(!validRoles) return true;
    if(validRoles.length === 0) return true;



    if(!user) throw new BadRequestException('Usuario no existe')
    
    console.log('user: ', user.roles);

    for (const role of user.roles) {
      if (validRoles.includes(role)){
        return true;

      }
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role: ${validRoles}`)

  }
}
