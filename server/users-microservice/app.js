const http = require('http');
const config = require('./config');

function setCorsOrigin(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Max-Age', 3600);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
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
                let jsonBody;
                try {
                    jsonBody = JSON.parse(data);
                } catch (e) {
                    res.statusCode = 400;
                    res.statusMessage = 'Bad Request';
                    res.end('Invalid request body, expected valid JSON');
                    return;
                }
                await require('./server/controller')(req, res, jsonBody);
            } else {
                await require('./server/controller')(req, res, null);
            }
        });
    }).listen(config.PORT, config.HOSTNAME);

console.log(`Listening at ${config.HOSTNAME}:${config.PORT}`);
