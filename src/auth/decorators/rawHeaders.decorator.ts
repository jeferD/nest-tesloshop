import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



export const RawHeraders = createParamDecorator(
    (data, ctx: ExecutionContext)=>{
        console.log('data: ', data);


        console.log('RawHeraders*************************')
        const req = ctx.switchToHttp().getRequest()
        const raw = req.rawHeaders;
        console.log('raw: ', raw);

        if(!raw) throw new InternalServerErrorException('raw no asignado en la peticion')

        return raw

    }
);