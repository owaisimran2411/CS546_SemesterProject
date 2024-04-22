import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
// import methods from './data/user.js';
import methods from './data/product.js';
import {
  configureDotEnv
} from './helper.js'


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

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

const { PORT_NUMBER } = process.env

// app.listen(PORT_NUMBER, () => {
//   console.log("We've now got a server!");
//   console.log(`Your routes will be running on http://localhost:${PORT_NUMBER}`);
// });


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
    const renamedIPhonePro = await prodMethod.default.createProduct(

      "prod_name1",
      "description",
      "condition",
      "serial no.",
      33,
      ["Nintendo Wii"],
      "thumbnail",
      ["otherImg"],
      true,
      "660a1f58411aa9ec268e4412",
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
    const products = await methods.getAllProductsTest(true)
    console.log(products);
  }
  catch (e) {
    console.log(e);
  }
  
}
getAllProductsTest()




