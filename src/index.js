require('dotenv/config');
const App = require('./server.2');

const app = new App();

app.start();