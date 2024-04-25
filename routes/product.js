import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'



helperMethods.configureDotEnv();


const router = Router()

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

export default router;