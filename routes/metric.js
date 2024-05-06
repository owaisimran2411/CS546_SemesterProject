import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'
import { productData } from '../data/index.js'


const router = Router()


router.
    route('/getMetrics/:console')
    .get(async (req, res) => {
        console.log(req.params.console);
        let sum = 0;
        let average;
        try {
            const productHistory = await productData.getProducts(true, 1, 1, { productSupportedConsole: req.params.console }, {}, { _id: 0, productAskingPrice: 1 });
            for (let i = 0; i < productHistory.length; i++) {
                let currentPrice = productHistory[i].productAskingPrice;
                sum += currentPrice;
            }
            average = sum / productHistory.length;
            return res.status(200).json({ averagePrice: average })
        }
        catch (e) {
            console.log(e);
        }
    })

export default router;