const http = require('http');
const config = require('./config');

function setCorsOrigin(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
}

http.createServer(
  function (req, res) {
    setCorsOrigin(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', async () => {
      if (data != '') {
        await require('./auth')(req, res, JSON.parse(data));
      } else {
        await require('./auth')(req, res, null);
      }
    });
  }).listen(config.PORT, config.HOSTNAME);

console.log(`Listening at ${config.HOSTNAME}:${config.PORT}`);
