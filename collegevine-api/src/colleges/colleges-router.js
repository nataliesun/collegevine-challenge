const express = require('express');
const { CollegesService } = require('./colleges-service');
const db = require('../../db/locations.json');
const collegesRouter = express.Router();
const jsonBodyParser = express.json();

const service = new CollegesService(db);

collegesRouter
  .route('/distance')
  .all(jsonBodyParser)
  .post((req, res, next) => {
    const { lat, lon } = req.body;
    console.log(lat, lon);
    const colleges = service.getAllWithDistances(lat, lon);

    res.json(colleges);
  });

module.exports = collegesRouter;
