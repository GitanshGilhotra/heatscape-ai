const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');

router.get('/cities', climateController.getCities);
router.get('/cities/:id', climateController.getCityById);
router.get('/interventions', climateController.getInterventions);
router.get('/analytics', climateController.getAnalytics);
router.get('/weather/:cityName', climateController.getLiveWeather);
router.get('/system-status', climateController.getSystemStatus);

module.exports = router;

