import { SetMetadata } from '@nestjs/common';
import { ValidRole } from 'src/auth/interfaces/valid-roles';
export const META_ROLES = 'roles' //la palabra que llega del controlador
export const RoleProtected = (...args: ValidRole[]) => {
    console.log('args: ', args);
    
    return SetMetadata(META_ROLES, args);
}
