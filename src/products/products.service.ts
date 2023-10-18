import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {validate as isUUID} from 'uuid'
import { NotFoundError } from 'rxjs';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
     @InjectRepository(Product)
     private readonly productRepository: Repository<Product>,
     @InjectRepository(ProductImage)
     private readonly productImagesRepository: Repository<ProductImage>,

     private readonly dataSource: DataSource, /// sabe que las credenciales de la DB
  ){}

  async create(createProductDto: CreateProductDto, user: User) {

    try {

      // if(!createProductDto.slug){
      //   createProductDto.slug = createProductDto.title.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
      // }else{
      //   createProductDto.slug = createProductDto.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')

      // }
      const { images= [], ...productDetails} = createProductDto
      
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImagesRepository.create({url:image})),
        user,
      })
      await this.productRepository.save(product);

      return {...product, images}; 


    } catch (error) {
      console.log(error)
      this.handleExceptionms(error) 
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit= 10, offset=0} = paginationDto
    const product =  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations:{
        images: true
      }
    });

    return product.map(product => ({
      ...product,
      images: product.images.map(img=> img.url)
    }))
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

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images , ...toUpdate } = updateProductDto;

    const product= await this.productRepository.preload({
      id:id,
      ...toUpdate
    })
    if(!product){
      throw new NotFoundException('Producto no encotrado')
    }

    // create queryrunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    
    try {
      if(images){
        await queryRunner.manager.delete(ProductImage, {product: {id}} )

        product.images = images.map(image=> this.productImagesRepository.create({url:image}))
      }else{
        product.images = await this.productImagesRepository.findBy({product:{id}})
      }
      await queryRunner.manager.save(product) //no impacta a la BD hasta que se haga el commit puede que falle

      product.user= user
      await queryRunner.commitTransaction(); // hasta aqui esta todo bien, entyopnces almacena todo
      await queryRunner.release(); //con esto ya se desconecta a la BD
      return product ;
      
    } catch (error) {
      await queryRunner.rollbackTransaction()//si sale algun error hace rollback

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

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      console.log('error: ', error);
      
    }
  }
}
