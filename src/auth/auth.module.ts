import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy ],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        // console.log('JWT Secret', configService.get('JWT_SECRET') )
        // console.log('JWT SECRET', process.env.JWT_SECRET)
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn:'2h'
          }
        }
      }
    })
    // JwtModule.register({
      // secret: process.env.JWT_SECRET,
      // signOptions: {
      //   expiresIn:'2h'
      // }
    // })

  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
  // controllers: [AuthController],
  // providers: [AuthService, JwtStrategy],
  // imports: [
  //   TypeOrmModule.forFeature([User]),// con esto hago que cree la tabla en la BD
  //   PassportModule.register({
  //     defaultStrategy: 'jwt'
  //   }),
  //   JwtModule.registerAsync({
  //     imports:[ConfigModule],
  //     inject:[ConfigService],
  //     useFactory:(configService:ConfigService) => {

  //       console.log('configService: ', configService.get('JWT_SECRET'));
  //       console.log('process.env.JWT_SECRET: ', process.env.JWT_SECRET);
  //       return {
  //         secret: configService.get('JWT_SECRET'),
  //         signOptions: {
  //           expiresIn: '2h'
  //         }
  //       }
  //     }
  //   })
  //   // JwtModule.register({ //configuracions para el jwt que permite la dependencia
  //   //   secret: process.env.JWT_SECRET,
  //   //   signOptions: {
  //   //     expiresIn: '2h'
  //   //   }
  //   // })
  // ],
  // exports:[JwtStrategy, TypeOrmModule, PassportModule, JwtModule]
})
export class AuthModule {}