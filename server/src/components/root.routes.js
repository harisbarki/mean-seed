let fs = require('fs');

let usersRoutes = require('./user/user.routes');
let seedRoutes = require('./seed/seed.routes');
let contactUsRoutes = require('./contact-us/contact-us.routes');

let clientPath = '../../client_dist/index.html';

module.exports = function(app) {

	app.use('/api/user', usersRoutes);
	app.use('/api/seed', seedRoutes);
	app.use('/api/contact-us', contactUsRoutes);

	app.get('*', function (req, res) {
		if (fs.existsSync(clientPath)) {
			res.sendFile(path.join(__dirname + clientPath));
		} else {
			console.log('<p>Either your frontend is not compiled or you are running hmr, if latter then please go to 127.0.0.1:4200');
			res.send("<p>You are running hmr please go to <a href='http://127.0.0.1:4200'>127.0.0.1:4200</a>"
				+ "<br>Also you need to start the browser without security for cross scripting if you want to make api calls to the backend"
				+ "<br>Example command:"
				+ "<br><code>\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\" --user-data-dir=\"C:/Chrome dev session2\" --disable-web-security</code></p>");
		}
	});
};
