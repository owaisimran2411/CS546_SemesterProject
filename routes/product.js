import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'
import {productData, userData, bidData} from '../data/index.js';



helperMethods.configureDotEnv();


const router = Router()

router.route('/')
.get(async (req, res) => {
    try {
      const productList = await productData.getProducts(true, 8, 1, 1, 1, 1);
      return res.render('product/index', {products: productList});
    } catch (e) {
      res.status(500).json({error: e});
    }
})
.post(helperMethods.createMulterObject(helperMethods.createS3Client(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.S3_REGION), process.env.S3_BUCKET, 'coverImage').array('file', 5), async (req, res) => {
    console.log(req.files, typeof req.files)
    req.files.forEach((item) => {
        console.log(item.location)
    })
    return res.json({
        message: 'Upload Successful'
    })
});

router
  .route('/:id')
  .get(async (req, res) => {
    // try {
    //   req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    // } catch (e) {
    //   return res.status(400).json({error: e});
    // }
    try {
      const product = await productData.getProductById(req.params.id);
      const prodId = product._id.toString();
      const bids = await bidData.getBidByProductId(prodId);
      return res.render('product/single', {product: product, bids: bids});
      console.log("text");
    } catch (e) {
      res.status(404).json({error: e});
    }
  });

export default router;