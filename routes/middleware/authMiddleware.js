const loginRequiredRoutes =
    [
        '/product/new',
        '/product/new/:id',
        '/product/user/:action/:productID',
        '/product/:id',
        '/profile',
        '/profile/update/:id',
        '/my-products',
        '/complaint/createComplaintSeller/:id',
        '/complaint/createComplaintProduct/:id',
        '/bid/createBid'
    ];
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    else {
        return res.redirect('/login');
    }
}
export {
    isAuthenticated,
    loginRequiredRoutes
}