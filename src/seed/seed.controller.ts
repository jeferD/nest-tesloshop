import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidRole } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/aut.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

 
  @Get()
  // @Auth(ValidRole.admin)//decorador creado para agregar mas decoradores algo asi como un barril
  executeSeed() {
    return this.seedService.runSeed();
  }

 
}
