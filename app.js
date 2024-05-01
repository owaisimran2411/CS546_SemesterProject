import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
// import methods from './data/user.js';
import session from 'express-session';
// import methods from './data/product.js';
import {
  configureDotEnv
} from './helper.js'
import { ObjectId } from 'mongodb';
import { bidData } from './data/index.js';
import { productData } from './data/index.js';

configureDotEnv()

const app = express();
const staticDir = express.static('public');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === '')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },

    partialsDir: ['views/partials/']
  }
});

app.use(
  session({
    name: 'AuthenticationState',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 }
  })
);

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

const { PORT_NUMBER } = process.env

app.listen(PORT_NUMBER, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${PORT_NUMBER}`);
});


// database function check
async function mainR() {
  try {
    const renamedIPhonePro = await methods.userSignUp(

      "username",
      "password",
      "security ques 3",
      "security ans 3",
      "security question 4",
      "security answer 4",
      "email",
      2334132132,
      "male",
      "My bio",
      "profile pic"
    );
    console.log(renamedIPhonePro);
  } catch (error) {
    console.error("Error adding user:", error); // Log the error message
  }
}
// mainR();

async function mainP() {
  try {
    const renamedIPhonePro = await productData.createProduct(

      "prod_name3",
      "description3",
      "condition3",
      "serial no.3",
      33,
      ["Nintendo Wii"],
      "thumbnail",
      ["otherImg"],
      true,
      "662bfe6fac8facf5b4496d06",
    );
    console.log(renamedIPhonePro);
  } catch (error) {
    console.error("Error adding product:", error); // Log the error message
  }
}
// mainP();
async function testUpdate() {
  try {
    const updatedUser = await methods.updateUser("6622bcf97925edab254e523f",
      {
        password: 'updatedPassword',
        bio: 'updatedBio'
      });
    console.log(updatedUser);
  }
  catch (e) {
    console.log(e);
  }
}
// testUpdate();
async function testFind() {
  try {
    console.log('Find with username:');
    const user = await methods.getUserByUsername('username2');
    console.log(user);
  }
  catch (e) {
    console.log(e);
  }
  try {
    console.log('Find with email:');
    const user = await methods.getUserByEmail('email2');
    console.log(user);
  }
  catch (e) {
    console.log(e);
  }
}
// testFind();

async function getAllProductsTest() {
  try {
    console.log('Get All Products');
    const products = await methods.deleteProductWithSpecificOwnerID('660a1f58411aa9ec268e4412')
    console.log(products);
  }
  catch (e) {
    console.log(e);
  }

}
// getAllProductsTest()
/* async function testProductGet() {
  try {
    const userProductInfo = await productData.getProducts(true, 5, 1, { productOwnerId: "662bfe6fac8facf5b4496d06" }, {}, {});
    console.log(userProductInfo);
  }
  catch (e) {
    console.log(e);
  }
}
testProductGet(); */