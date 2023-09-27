import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate} from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price:number;

    @Column({
        type:'text',
        nullable: true
    })
    description: string;

    @Column('text',{
        unique: true
    })
    slug:string;

    @Column('int',{
        default:0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes:string[]

    @Column('text')
    gender: string;

    //tags

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]
    //images

    @BeforeInsert()//balidar antes de guardar que el before este asi
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title.toLowerCase().replaceAll(' ','_').replaceAll("'",'').replaceAll("-",'_')
          }else{
            this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
          }
    }

    @BeforeUpdate()//balidar antes de guardar que el before este asi
    checkSlugUpdate(){
        this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }
}
