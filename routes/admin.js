import {
    Router
} from 'express'
import * as helperMethods from './../helper.js'


helperMethods.configureDotEnv();

const router = Router()

router.route('/')
.get(async (req, res) => {
    
})


router.route('/view-all-products')
.get(async (req, res) => {
    
})
export default router;