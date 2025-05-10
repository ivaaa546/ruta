const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudadController');

router.get('/', ciudadController.getCiudades);
router.post('/', ciudadController.addCiudad);
router.delete('/:id', ciudadController.deleteCiudad);
router.put('/:id', ciudadController.updateCiudad);

module.exports = router;