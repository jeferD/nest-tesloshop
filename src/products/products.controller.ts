import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/aut.decorator';
import { ValidRole } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
@Auth()//decorador creado para agregar mas decoradores algo asi como un barril

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRole.user)//decorador creado para agregar mas decoradores algo asi como un barril
  create(@Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRole.user)//decorador creado para agregar mas decoradores algo asi como un barril
  findAll(@Query() paginationDto:PaginationDto) {
    console.log('paginationDto: ', paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRole.user)//decorador creado para agregar mas decoradores algo asi como un barril
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRole.user)//decorador creado para agregar mas decoradores algo asi como un barril
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,
      @GetUser() user: User 
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRole.user)//decorador creado para agregar mas decoradores algo asi como un barril
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
