import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'



helperMethods.configureDotEnv();
// const s3Client = 
// const productCoverImageClient = helperMethods.createMulterObject(s3Client, process.env.S3_BUCKET, 'coverImage')


const router = Router()

// router.post('/', , (req, res) => {

// })

router.route('/')
.post(helperMethods.createMulterObject(helperMethods.createS3Client(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.S3_REGION), process.env.S3_BUCKET, 'coverImage').array('file', 5), async (req, res) => {
    console.log(req.files, typeof req.files)
    req.files.forEach((item) => {
        console.log(item.location)
    })
    return res.json({
        message: 'Upload Successful'
    })
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