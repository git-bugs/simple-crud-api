require('dotenv').config();
const http = require('http');
const personRouter = require('./person-router');
const sendMiddle = require('./middlewares/send-middle');

const routes = (req, res) => {
  sendMiddle(req, res);
  personRouter(req, res);
};

const port = process.env.PORT || 5000;
const server = http.createServer(routes);


server.listen(port, () => console.log(`Launched on port: ${port}`));

