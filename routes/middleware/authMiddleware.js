const loginRequiredRoutes = [
	"/product/new",
	"/product/new/:id",
	"/product/user/:action/:productID",
	"/product/:id",
	"/profile",
	"/profile/update/:id",
	"/my-products",
	"/complaint/createComplaintSeller/:id",
	"/complaint/createComplaintProduct/:id",
	"/bid/createBid",
];

const isAuthenticated = (req, res, next) => {
	if (req.session.user || req.session.admin) {
		return next();
	} else {
		return res.redirect("/login");
	}
};

const adminAuthenticatedRoutes = [
	"/admin/view-all-products",
	"/admin/view-all-complaints",
	"/admin/view-all-complaints-product",
	"/admin/view-all-users",
	"/admin/complaint/*",
	"/admin/user/*",
	"/admin/product/*",
	"/admin/complaint/*",
];
const isAdminAuthenticated = (req, res, next) => {
	if (req.session && req.session.admin && req.session.admin.adminAuthenicated) {
		return next();
	} else {
		return res.redirect("/admin/login");
	}
};
export {
	isAuthenticated,
	loginRequiredRoutes,
	adminAuthenticatedRoutes,
	isAdminAuthenticated,
};
