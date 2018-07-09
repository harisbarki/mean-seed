let express = require('express');
let path = require('path');
let compression = require('compression');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// compresses files for response, gzip
app.use(compression());
require('./shared/database'); // database make connection
// set public path for client side
app.use(express.static(path.join(__dirname, '../client_dist')));

require('./shared/passport');	// setup for passport
require('./components/root.routes')(app);	// setup all routes


module.exports = app;
