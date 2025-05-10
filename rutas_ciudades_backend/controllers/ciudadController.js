const Ciudad= require('../models/ciudadModel');
const db = require('../config/db'); // Asegúrate de que la ruta sea correcta

/*exports.getCiudades = (req, res) => {
    Ciudad.obtenerTodas((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };*/

exports.getCiudades = (req, res) => {
    db.query('SELECT id, nombre FROM ciudades', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };

exports.addCiudad = (req, res) => {
    const { nombre } = req.body;
    Ciudad.crear(nombre, (err, result) => {
      if (err) return res.status(400).json({ error: err });
      res.status(201).json({ mensaje: 'Ciudad agregada', id: result.insertId });
    });
  };

exports.deleteCiudad = (req, res) => {
    const { id } = req.params;
    Ciudad.eliminar(id, (err) => {
      if (err) return res.status(400).json({ error: err });
      res.json({ mensaje: 'Ciudad eliminada' });
    });
  };


exports.updateCiudad = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    Ciudad.actualizar(id, nombre, (err) => {
      if (err) return res.status(400).json({ error: err });
      res.json({ mensaje: 'Ciudad actualizada' });
    });
  };