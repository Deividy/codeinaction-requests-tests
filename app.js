const http = require('http');

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
    try {
        const postData = await getJsonBody(req);
        console.log(postData);
        console.log(postData.video);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('sucesso! :D');
    } catch (ex) {
        console.error(ex);

        res.statusCode = 500;

        res.setHeader('Content-Type', 'text/plain');
        res.end(ex.message);
    }
}

function requestHandler (req, res) {
    if (req.url === '/post-codeinaction' && req.method === 'POST') {
        return postInActionHandler(req, res);
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
}

const server = http.createServer(requestHandler);
server.listen(port, host, () => {
    console.log(`running ${host}:${port}`);
});
