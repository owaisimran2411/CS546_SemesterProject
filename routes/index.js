import bidRoute from "./bid.js";
import complaintRoute from "./complaint.js";
import metricRoutes from "./metric.js";
import productRoutes from "./product.js";
import userRoutes from "./user.js";
import adminRoutes from "./admin.js";

const constructorMethod = (app) => {
	app.use("/", userRoutes);
	app.use("/product", productRoutes);
	app.use("/admin", adminRoutes);
	app.use("/bid", bidRoute);
	app.use("/complaint", complaintRoute);
	app.use('*', (req, res) => {
		res.redirect('/product');
	});
};

export default constructorMethod;
