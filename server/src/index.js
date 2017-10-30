let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let sassMiddleware = require('node-sass-middleware');
require('./shared/database'); // database make connection

let app = express();

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'pug');

// app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, '../public'),
	dest: path.join(__dirname, '../public'),
	indentedSyntax: true, // true = .sass and false = .scss
	sourceMap: true
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../client_dist')));

require('./components/root.routes')(app);

module.exports = app;