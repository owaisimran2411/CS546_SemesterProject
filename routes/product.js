import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'

import multer from 'multer';
import multerS3 from 'multer-s3'
import {
  S3Client, PutObjectCommand,
} from '@aws-sdk/client-s3'


helperMethods.configureDotEnv();
const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET,
        acl: 'public-read',
        key: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
        }
    })
})


const router = Router()

router.post('/', upload.single('file'), (req, res) => {

})
// router.route('/')
// .post(async(req, res) => {
//     console.log('POST Req received')
//     helperMethods.configureDotEnv()

//     await 
    
//     await helperMethods.handleSingleFileUpload(
//         req,
//         'abc',
//         'profile-picture',
//         process.env.AWS_ACCESS_KEY_ID,
//         process.env.AWS_SECRET_ACCESS_KEY,
//         process.env.S3_REGION,
//         process.env.S3_BUCKET
//     ).then(data => {
//         res.status(200).json({
//             message: 'success',
//             data
//         })
//     }).catch(error => {
//         res.status(400).json({
//             message: 'An error occurred',
//             error
//         })
//     })
// })

export default router;