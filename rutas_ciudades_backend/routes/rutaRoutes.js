const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');

router.get('/', rutaController.getRutas);
router.post('/', rutaController.addRuta);
router.delete('/:id', rutaController.deleteRuta);
router.put('/:id', rutaController.updateRuta);
router.get('/optimas', rutaController.getRutasOptimas);

module.exports = router;