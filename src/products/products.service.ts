import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {validate as isUUID} from 'uuid'
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
     @InjectRepository(Product)
     private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {

    try {

      // if(!createProductDto.slug){
      //   createProductDto.slug = createProductDto.title.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
      // }else{
      //   createProductDto.slug = createProductDto.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')

      // }
      
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product);

      return product; 


    } catch (error) {
      console.log(error)
      this.handleExceptionms(error) 
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit= 10, offset=0} = paginationDto
    return await this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
  //   let product: Product;

  //   if (isUUID(term)) {
  //     product = await this.productRepository.findOneBy({ id: term });
  // } else {
  //     const queryBuilder = this.productRepository.createQueryBuilder();
  //     product = await queryBuilder
  //         .where('UPPER(title) = :title OR slug = :slug', {
  //             title: term.toUpperCase(),
  //             slug: term.toLowerCase(),
  //         })
  //         .getOne();
  // }

    return await this.productRepository.findOneBy({ id: term });
}

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product= await this.productRepository.preload({
      id:id,
      ...updateProductDto
    })
    if(!product){
      throw new NotFoundException('Producto no encotrado')
    }

    try {
      return this.productRepository.save(product) ;
      
    } catch (error) {
      this.handleExceptionms(error) 
    }
  }


  async remove(id: string) {
    const product =  await this.productRepository.findOneBy({id});

    await this.productRepository.remove(product);
  }


  private handleExceptionms( error : any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Algo salio mal en crear producto')
  }
}
