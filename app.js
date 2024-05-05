import express from "express";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
// import methods from './data/user.js';
import session from "express-session";
// import methods from './data/product.js';
import { configureDotEnv } from "./helper.js";
import { ObjectId } from "mongodb";
import { bidData } from "./data/index.js";
import { productData } from "./data/index.js";
import {
	loginRequiredRoutes,
	isAuthenticated,
	adminAuthenticatedRoutes,
	isAdminAuthenticated,
} from "./routes/middleware/authMiddleware.js";

configureDotEnv();

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   // If the user posts to the server with a property called _method, rewrite the request's method
//   // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
//   // rewritten in this middleware to a PUT route
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }

//   // let the next middleware run:
//   next();
// };

const app = express();
const staticDir = express.static("public");

const handlebarsInstance = exphbs.create({
	defaultLayout: "main",
	// Specify helpers which are only registered on this instance.
	helpers: {
		asJSON: (obj, spacing) => {
			if (typeof spacing === "")
				return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

			return new Handlebars.SafeString(JSON.stringify(obj));
		},
		ifCond: function (v1, operator, v2, options) {
			switch (operator) {
				case "===":
					return v1 === v2 ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
			}
		},

		partialsDir: ["views/partials/"],
	},
});

app.use(
	session({
		name: "AuthenticationState",
		secret: "This is a secret.. shhh don't tell anyone",
		saveUninitialized: false,
		resave: false,
	})
);

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(loginRequiredRoutes, isAuthenticated);
app.use(adminAuthenticatedRoutes, isAdminAuthenticated);

configRoutes(app);

const { PORT_NUMBER } = process.env;

app.listen(PORT_NUMBER, () => {
	console.log("We've now got a server!");
	console.log(`Your routes will be running on http://localhost:${PORT_NUMBER}`);
});
