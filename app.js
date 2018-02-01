const http = require('http');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 9000;
const host = 'localhost';
const secret = '#codeinaction TAMOJUNTO! :)';

function postInActionHandler (req, res) {
    const postData = req.body;

    console.log(postData);
    console.log(postData.video);

    res.status(200).send('sucesso! agora com express :)');
}

function postSetJwt (req, res) {
    const postData = req.body;
    const { codeinaction } = postData;

    const token = jwt.sign({ codeinaction }, secret);
    res.status(200).send(token);
}

function getVerifyJwt (req, res) {
    const { headers } = req;
    const { authorization } = headers;

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, secret);

    const decodedToken = jwt.decode(token);
    res.status(200).send(decodedToken.codeinaction);
}

app.post('/post-codeinaction', bodyParser.json(), postInActionHandler);
app.post('/set-jwt', bodyParser.json(), postSetJwt);
app.get('/verify-jwt', getVerifyJwt);

app.use(function (req, res) { res.status(404).send('Not found'); });

app.listen(port, host, () => {
    console.log(`running ${host}:${port}`);
});
