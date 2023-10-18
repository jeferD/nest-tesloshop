import { Product } from "src/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";

@Entity('user')//le pone el nomebre a la tabla
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{
        unique: true
    })
    email:string;
    @Column('text',{
        select: false // con esto cada vez que se consulte la BD no se tra este dato 
    })
    password: string;
    @Column('text')
    fullName: string;
    @Column('bool',{
        default: true
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        ()=>Product,
        (product) => product.user,
    )
    product: Product;

    @BeforeInsert()
    checkFiledsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFiledsBeforeUpdate(){
        this.checkFiledsBeforeInsert()
    }
}
