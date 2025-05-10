const db = require('../config/db');
const Ruta= require('../models/rutaModel');
const { dijkstra } = require('../utils/dijkstra');

exports.getRutas = (req, res) => {
    Ruta.obtenerTodas((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };

exports.addRuta = (req, res) => {
    const { origenId, destinoId, distancia, estado } = req.body;
  
    if (origenId === destinoId) {
      return res.status(400).json({ error: 'No se puede crear una ruta hacia la misma ciudad.' });
    }
  
    Ruta.crear(origenId, destinoId, distancia, estado || 'activa', (err, result) => {
      if (err) return res.status(400).json({ error: err.sqlMessage });
      res.status(201).json({ mensaje: 'Ruta agregada', id: result.insertId });
    });
  };


exports.deleteRuta = (req, res) => {
    const { id } = req.params;
    Ruta.eliminar(id, (err) => {
      if (err) return res.status(400).json({ error: err });
      res.json({ mensaje: 'Ruta eliminada' });
    });
  };


exports.updateRuta = (req, res) => {
    const { id } = req.params;
    const { origenId, destinoId, distancia, estado } = req.body;
  
    // Verificación de datos
    console.log("Datos recibidos:", { id, origenId, destinoId, distancia, estado });
  
    if (!origenId || !destinoId || !distancia || !estado) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
  
    // Actualizar la ruta en la base de datos
    Ruta.actualizar(id, origenId, destinoId, distancia, estado, (err) => {
      if (err) {
        console.error("Error al actualizar la ruta: ", err);
        return res.status(500).json({ error: 'Error al actualizar la ruta.' });
      }
      res.json({ mensaje: 'Ruta actualizada correctamente' });
    });
  };
  

//Dijkstra
exports.getRutasOptimas = (req, res) => {
    const { origen, destino } = req.query;
  
    if (!origen || !destino) {
      return res.status(400).json({ error: 'Origen y destino son requeridos' });
    }
  
    // Obtener todas las ciudades
    db.query(`SELECT id, nombre FROM ciudades`, (err, ciudades) => {
      if (err) return res.status(500).json({ error: err });
  
      const nombrePorId = {};
      ciudades.forEach(c => nombrePorId[c.id] = c.nombre);
  
      // Obtener rutas activas
      db.query(`SELECT * FROM rutas WHERE estado = 'activa'`, (err, rutas) => {
        if (err) return res.status(500).json({ error: err });
  
        const grafo = {};
  
        rutas.forEach(r => {
          if (!grafo[r.ciudad_origen_id]) grafo[r.ciudad_origen_id] = [];
          grafo[r.ciudad_origen_id].push({ dest: r.ciudad_destino_id.toString(), dist: r.distancia });
  
          // Bidireccional
          if (!grafo[r.ciudad_destino_id]) grafo[r.ciudad_destino_id] = [];
          grafo[r.ciudad_destino_id].push({ dest: r.ciudad_origen_id.toString(), dist: r.distancia });
        });
  
        // Ruta 1
        const ruta1 = dijkstra(grafo, origen, destino);
        if (!ruta1.path.length || ruta1.distance === null) {
          return res.status(404).json({ error: 'No hay ruta disponible entre las ciudades.' });
        }
  
        // Clonar grafo y eliminar primer arista para ruta 2
        const nuevoGrafo = JSON.parse(JSON.stringify(grafo));
        for (let i = 0; i < ruta1.path.length - 1; i++) {
          const a = ruta1.path[i];
          const b = ruta1.path[i + 1];
          nuevoGrafo[a] = nuevoGrafo[a].filter(n => n.dest !== b);
          nuevoGrafo[b] = nuevoGrafo[b].filter(n => n.dest !== a);
          break;
        }
  
        const ruta2 = dijkstra(nuevoGrafo, origen, destino);
  
        // Traducir IDs a nombres
        const traducirRuta = (ruta) => ruta.path.map(id => nombrePorId[parseInt(id)] || `ID:${id}`);
  
        res.json({
          origen: nombrePorId[parseInt(origen)],
          destino: nombrePorId[parseInt(destino)],
          rutas: [
            {
              camino: traducirRuta(ruta1),
              distancia: ruta1.distance
            },
            {
              camino: ruta2.distance ? traducirRuta(ruta2) : [],
              distancia: ruta2.distance ?? 'no disponible'
            }
          ]
        });
      });
    });
  };