import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'
import {productData, userData} from '../data/index.js';



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

router.route('/new')
.get(async (req, res) => {
  try {
    return res.render('product/productCreate', {
      uploadProcess1: true
    })
  } catch (e) {
    return res.status(404).json({
      error: e
    })
  }
})
.post(
  helperMethods
      .createMulterObject(
        helperMethods.createS3Client(
          process.env.AWS_ACCESS_KEY_ID,
          process.env.AWS_SECRET_ACCESS_KEY,
          process.env.S3_REGION
        ),
        process.env.S3_BUCKET,
        "productThumbnail"
      )
      .single("productThumbnail"),
  async (req, res) => {
    if(
      req.file &&
      req.body.productName //&&
      // req.session.user
    ) {
      try {
        let productName = undefined

        helperMethods.argumentProvidedValidation(req.body.productName, 'productName')
        productName = helperMethods.primitiveTypeValidation(req.body.productName, 'productName', 'String')

        const coverImage = req.file.location;
        const id = req.file.key.split("-")[0];

        const productCreate = await productData.createProduct_Phase1(
          productName, '6632ac2938618897ebdc703b', coverImage, id
        )
        return res.redirect(
          `/product/new/${id}`
        )
        
      } catch (e) {
        return res.status(400).json({
          error: e
        })
      }
    } else {
      return res.status(404).json({
        error: 'All fields not present'
      })
    }
})

router.route('/new/:id')
.get(async (req, res) => {
  res.render(
    'product/productCreate', {
      uploadProcess2: true,
      productID: req.params.id
    }
  )
})
.post(
  helperMethods
      .createMulterObject(
        helperMethods.createS3Client(
          process.env.AWS_ACCESS_KEY_ID,
          process.env.AWS_SECRET_ACCESS_KEY,
          process.env.S3_REGION
        ),
        process.env.S3_BUCKET,
        "productOtherImages",
        true
      )
      .array("productOtherImages", 10),
  async (req, res) => {
    let otherImages = []
    try {
      for(let i=0; i<req.files.length; i++) {
        const copy = await helperMethods.moveFileFromTempToDestinationLocation(
          helperMethods.createS3Client(
            process.env.AWS_ACCESS_KEY_ID,
            process.env.AWS_SECRET_ACCESS_KEY,
            process.env.S3_REGION
          ),
          req.files[i], req.params.id)
          // console.log(copy)
        otherImages.push(copy)
      }

      

      // Type validation
      if(
        req.body.productDescription &&
        req.body.productCondition &&
        req.body.productSerialNumber &&
        req.body.productSupportedConsole &&
        req.body.productAskingPrice
      ) {
        let productDescription = helperMethods.primitiveTypeValidation(req.body.productDescription, 'productDescription', 'String')
        let productCondition = helperMethods.primitiveTypeValidation(req.body.productCondition, 'productCondition', 'String')
        let productSerialNumber = helperMethods.primitiveTypeValidation(req.body.productSerialNumber, 'productSerialNumber', 'String')
        let productSupportedConsole = helperMethods.primitiveTypeValidation(req.body.productSupportedConsole, 'productSupportedConsole', 'String')
        let productAskingPrice = helperMethods.primitiveTypeValidation(Number(req.body.productAskingPrice), 'productAskingPrice', 'Number')

        const productUpdate = await productData.createProduct_Phase2(
          req.params.id, 
          '6632ac2938618897ebdc703b', 
          productDescription, 
          productCondition,
          productSerialNumber,
          productAskingPrice,
          productSupportedConsole,
          otherImages 
        )

        return res.json(
          productUpdate
        )
        
        
      } else {
        res.json( {
          error: 'fields missing'
        })
      }
    } catch (e) {
      return res.json({
        error: e
      })
    }
    
})

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
      return res.render('product/single', {product: product});
      console.log("text");
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });


export default router;