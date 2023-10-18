import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeraders } from './decorators/rawHeaders.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRole } from './interfaces/valid-roles';
import { Auth } from './decorators/aut.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,

  ){
    return this.authService.checkAuthStatus(user)
  }

  
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
      @Req() request: Express.Request,
      @GetUser() user: User,
      @GetUser('email') userEmail: string,
      @RawHeraders() raw: string[],
      // @Headers() headers: IncomingHttpHeaders

    ){
    console.log('user: ', user);

    return {user, ok: 'Ok', raw}
  } 

  @Get('private2')
  // @SetMetadata('roles',['admin', 'super-user'])//puede que se genere un error y es mejor que se cree un custom decoration
  @RoleProtected(ValidRole.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)//esto valida los roles que se colocan en la Set metadata
  testingPrivateRoute2(
      @GetUser() user: User,

    ){
    console.log('user: ', user);

    return {user, ok: 'Ok'}
  } 


  @Get('private3')
  // @SetMetadata('roles',['admin', 'super-user'])//puede que se genere un error y es mejor que se cree un custom decoration
  @Auth(ValidRole.admin)//decorador creado para agregar mas decoradores algo asi como un barril
  testingPrivateRoute3(
      @GetUser() user: User,

    ){
    console.log('user: ', user);

    return {user, ok: 'Ok'}
  } 
  //una forma de obtener los datos de usuario que los retorna la estategia jwt
  // @Get()
  // @UseGuards(AuthGuard())
  // testingPrivateRoute(@Req() request: Express.Request){
  //   console.log('request: ', request);
  //   return 'Hola *****'
  // }  
}
