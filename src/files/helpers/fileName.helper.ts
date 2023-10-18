import { callbackify } from "util";
import {v4 as uuid } from "uuid";


export const fileName = (req: Express.Request, file: Express.Multer.File, callback: Function)=>{
    console.log('file: ', {file});

    if(!file){
        return callback(new Error('File is empty'), false)
    }

   
    const fileExptension = file.mimetype.split('/')[1]
    const fileExptensionName = file.originalname.split('.')[0]

    const fileName=`${fileExptensionName}${uuid()}.${fileExptension}`
    
    callback(null, fileName )
}

