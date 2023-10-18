import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsServices: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>   ){

  }
  async runSeed(){
    await this.deleteTables()
    const adminUser = await this.insertUser()
    await this.insertNewProducts(adminUser)
    return 'Seed'
  }

  private async deleteTables(){ // esto va a borrar todos los usuarios
    await this.productsServices.deleteAllProducts();
    const queryBuilder  = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }
  private async insertUser(){
    const seedUser = initialData.users;
    console.log('seedUser: ', seedUser);

    const users: User[] = []

    // const {password , ...userData} = seedUser

    seedUser.forEach(user => {
      const {password , ...userData} = user
      users.push(this.userRepository.create(user))
    });

    const dbusers =  await this.userRepository.save(seedUser)

    return dbusers[0];
  }

  private async insertNewProducts(user : User){
    await this.productsServices.deleteAllProducts()
    const products = initialData.products

    const insertPromises = []
    products.forEach (products =>{
      insertPromises.push(this.productsServices.create(products, user))
    })

    await Promise.all(insertPromises)


    return true
  }
}
