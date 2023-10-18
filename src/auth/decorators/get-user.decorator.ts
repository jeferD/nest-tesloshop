import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext)=>{
        console.log('data: ', data);


        console.log('GetUser*************************')
        const req = ctx.switchToHttp().getRequest()// obtener los datos del usuario del reques
        const user = req.user;
        console.log('user: ', user);

        if(!user) throw new InternalServerErrorException('User no asignado en la peticion')

        return (!data) ? user : user[data]

    }
);