import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({name: 'product_images'})//con esto se le asigna el nombre a cada tabla 
export class ProductImage {
    
    
    @PrimaryGeneratedColumn()
    id: Number;

    @Column('text')
    url: string;

    @ManyToOne(()=>
        Product, 
        (product)=>product.images,
        {onDelete: 'CASCADE'}//para cuiando se borre un producto se borren las imagenes asociadas a el

        
    )
    product: Product
}