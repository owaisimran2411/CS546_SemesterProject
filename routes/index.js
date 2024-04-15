import bidRoute from './bid.js'
import complaintRoute from './complaint.js'
import metricRoutes from './metric.js';
import productRoutes from './product.js';
import userRoutes from './user.js'

import {userData} from './../data/index.js';

const constructorMethod = (app) => {
  // app.use('/product', calculatorRoutes);

  app.use('*', async (req, res) => {
    const data = await userData.dataFunction1()
    console.log(data)
    res.json({
      success: "server config done"
    })
  });
};

export default constructorMethod;
