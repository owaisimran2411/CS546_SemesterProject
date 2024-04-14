import calculatorRoutes from './product.js';

const constructorMethod = (app) => {
  app.use('/product', calculatorRoutes);

  app.use('*', (req, res) => {
    res.redirect('/product/static');
  });
};

export default constructorMethod;
