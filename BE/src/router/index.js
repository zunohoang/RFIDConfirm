const express = require('express');
const routerApi = require('./api.js');


function route(app) {
    app.use('/api', routerApi)
}

module.exports = route;
