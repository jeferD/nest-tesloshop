import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // con esto nos conectampos y creamos la instancia para crear usuarios en la BD
    private readonly jwtService: JwtService
 ){}


  async create(createUserDto: CreateUserDto) {

    const {password, ...userData} = createUserDto

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password // elimiar el password del objeto y que no se mire en la peticion
      return {...user, toke: this.getJwtToken({id: user.id})};

    } catch (error) {
      console.log('error: ', error);
      this.handleDBErrors(error)
    }
  }


  async login(loginUserDto: LoginUserDto){
    console.log('loginUserDto: ', loginUserDto);
    const {password, email} = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true} // con esto solicitamos traer estos datos 
      
      })
    if(!user){
      throw new UnauthorizedException('Usuario no valido email')
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Password no valido para el usuario')

    }

    return {...user, toke: this.getJwtToken({id: user.id})};
    
  }

  async checkAuthStatus(user: User){
    return {...user, toke: this.getJwtToken({id: user.id})};

  }


  private getJwtToken( payload: JwtPayload){
    //
    const token = this.jwtService.sign(payload);

    return token;
  }


  private handleDBErrors(error: any): never{ // never significa que no retorna nada
    console.log('error: ', error);
    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }

    throw new InternalServerErrorException('Revisar logs')
    
  }
}
