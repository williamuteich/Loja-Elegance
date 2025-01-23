import crypto from 'crypto'
import { Upload } from 'lucide-react'
import multer from 'multer'

import { extname, resolve } from 'path'

export default{
    Upload(folder: string){
        return{
            Storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString('hex')
                    const fileName = `${fileHash}-${file.originalname}`
                    return callback(null, fileName)
                }
            })
        }
    }
}