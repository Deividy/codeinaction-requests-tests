const http = require('http');
const jwt = require('jsonwebtoken');

const port = 9000;
const host = 'localhost';

async function getJsonBody (req) {
    return new Promise(function (resolve, reject) {
        let body = '';

        req.on('data', function (data) {
            body += data;

            // ~1mb
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });

        req.on('end', function () {
            try {
                resolve(JSON.parse(body));
            } catch (ex) {
                reject(ex);
            }
        });
    });
}

async function postInActionHandler (req, res) {
    const postData = await getJsonBody(req);
    console.log(postData);
    console.log(postData.video);

    sendText(res, 'sucesso! :D');
}


const secret = '#codeinaction TAMOJUNTO! :)';

async function postSetJwt (req, res) {
    const postData = await getJsonBody(req);
    const { codeinaction } = postData;

    const token = jwt.sign({ codeinaction }, secret);
    sendText(res, token);
}

function sendText (res, text) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(text);
}

function getVerifyJwt (req, res) {
    const { headers } = req;
    const { authorization } = headers;

    const token = authorization.replace('Bearer ', '');

    if (!jwt.verify(token, secret)) throw new Error('Invalid token');

    const decodedToken = jwt.decode(token);
    sendText(res, decodedToken.codeinaction);
}

function requestHandler (req, res) {
    try {
        if (req.url === '/post-codeinaction' && req.method === 'POST') {
            return postInActionHandler(req, res);
        }

        if (req.url === '/set-jwt' && req.method === 'POST') {
            return postSetJwt(req, res);
        }

        if (req.url === '/verify-jwt' && req.method === 'GET') {
            return getVerifyJwt(req, res);
        }
    } catch (ex) {
        console.error(ex);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(ex.message);
        return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
}

const server = http.createServer(requestHandler);
server.listen(port, host, () => {
    console.log(`running ${host}:${port}`);
});
