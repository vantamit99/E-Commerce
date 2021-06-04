const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 1999;
const expresslayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { checkUser } = require('./middleware/verifyToken');

const authRoute = require('./routes/auth.route');
const dashboardRoute = require('./routes/admin/dashboard.route');
const dashboardCateRoute = require('./routes/admin/cate.route');
const dashboardProductRoute = require('./routes/admin/product.route');
const dashboardStatusRoute = require('./routes/admin/status.route');
const dashboardPaymentRoute = require('./routes/admin/payment.route');
const dashboardRatingRoute = require('./routes/admin/rating.route');
const dashboardCustomerRoute = require('./routes/admin/customer.route');
const repCommentRoute = require('./routes/admin/repQuestion.route');
const dashboardRankRoute = require('./routes/admin/rank.route');
const dashboardRevenue = require('./routes/admin/revenue.route');

const homeRoute = require('./routes/user/home.route');
const productDetailsRoute = require('./routes/user/productDetails.route');
const paymentRoute = require('./routes/user/payment.route');
const cartRoute = require('./routes/user/cart.route');
const searchRoute = require('./routes/user/search.route');
const cateProRoute = require('./routes/user/cate.route');
const orderRoute = require('./routes/user/order.route');
const ratingRoute = require('./routes/user/rating.route');
const commentRoute = require('./routes/user/comment.route');
const filterPriceRoute = require('./routes/user/filterPrice.route');
const lookupPhoneRoute = require('./routes/user/lookupPhone.route');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/shoes', {useNewUrlParser: true});

app.use(cookieParser());
app.use(expresslayout);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.set('layout', './layout/layoutUser.ejs');
app.set('view engine', 'ejs');

app.get('*', checkUser);
// route user
app.use('/', homeRoute);
app.use('/product', productDetailsRoute);
app.use('/cart', cartRoute);
app.use('/payment', paymentRoute);
app.use('/search', searchRoute);
app.use('/cate', cateProRoute);
app.use('/order', orderRoute);
app.use('/rating', ratingRoute);
app.use('/comment', commentRoute);
app.use('/filterPrice', filterPriceRoute);
app.use('/lookupPhone', lookupPhoneRoute);
// route admin
app.use('/dashboard', dashboardRoute);
app.use('/dashboard/cate', dashboardCateRoute);
app.use('/dashboard/product', dashboardProductRoute);
app.use('/dashboard/status', dashboardStatusRoute);
app.use('/dashboard/payment', dashboardPaymentRoute);
app.use('/dashboard/rating', dashboardRatingRoute);
app.use('/dashboard/customer', dashboardCustomerRoute);
app.use('/comment/rep', repCommentRoute);
app.use('/dashboard/rank', dashboardRankRoute);
app.use('/dashboard/revenue', dashboardRevenue);
app.use('/auth', authRoute);

server.listen(port,()=>console.log('Server running...'));

// socket //
io.on('connection', socket => {;
    socket.on('sendToAdmin', (msg) => {
        io.sockets.emit('sendToClient', msg);
    });
}); 

