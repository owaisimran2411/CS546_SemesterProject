import bidRoute from "./bid.js";
import complaintRoute from "./complaint.js";
import metricRoutes from "./metric.js";
import productRoutes from "./product.js";
import userRoutes from "./user.js";
import adminRoutes from "./admin.js";

import { userData } from "./../data/index.js";

import * as helperMethods from "./../helper.js";

const constructorMethod = (app) => {
	app.use("/", userRoutes);
	app.use("/product", productRoutes);
	app.use("/admin", adminRoutes);
	app.use("/bid", bidRoute);
	app.use("/complaint", complaintRoute);
};

export default constructorMethod;
