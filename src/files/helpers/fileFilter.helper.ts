import { callbackify } from "util";

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function)=>{
    console.log('file: ', {file});

    if(!file){
        return callback(new Error('File is empty'), false)
    }

    const fileExptension = file.mimetype.split('/')[1]
    const validExtensions = ['jpg', 'jpeg', 'png']

    if(validExtensions.includes(fileExptension)){
        return callback(null, true)
    }else{
        callback(null, false )

    }

}

