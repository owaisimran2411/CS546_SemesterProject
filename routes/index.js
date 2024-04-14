import bidRoute from './bid.js'
import complaintRoute from './complaint.js'
import metricRoutes from './metric.js';
import productRoutes from './product.js';
import userRoutes from './user.js'

const constructorMethod = (app) => {
  app.use('/product', calculatorRoutes);

  app.use('*', (req, res) => {
    res.redirect('/product/static');
  });
};

export default constructorMethod;
