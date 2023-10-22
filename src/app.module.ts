import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MessageWsModule } from './message-ws/message-ws.module';

@Module({
  imports: [
      ConfigModule.forRoot(),

      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST, 
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,//cargar las entidades automaticamente
        synchronize: true//cuando se cambia una entidad esta se sincroniza, en produc se utiliza como en falso
      }),

      ProductsModule,

      ServeStaticModule.forRoot({
        rootPath: join(__dirname,'..','public'), 
      }),

      CommonModule,

      SeedModule,

      FilesModule,

      AuthModule,

      MessageWsModule
  ]
})
export class AppModule {}
