import bidRoute from './bid.js'
import complaintRoute from './complaint.js'
import metricRoutes from './metric.js';
import productRoutes from './product.js';
import userRoutes from './user.js'

import {userData} from './../data/index.js';

import * as helperMethods from './../helper.js'

const constructorMethod = (app) => {
  app.use('/product', productRoutes);

  app.use('*', async (req, res) => {
    res.send(
      `
      <h2>File Upload With <code>"Node.js"</code></h2>
      <form action="/product" enctype="multipart/form-data" method="post">
        <div>Select a file: 
          <input name="file" type="file" multiple />
        </div>
        <input type="submit" value="Upload" />
      </form>
      `
    )
  });

};

export default constructorMethod;
