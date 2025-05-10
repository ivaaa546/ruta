const db = require('../config/db');

const Ruta ={
    obtenerTodas: (callback) => {
        db.query(`
          SELECT r.id, co.nombre AS origen, cd.nombre AS destino, r.distancia, r.estado
          FROM rutas r
          JOIN ciudades co ON r.ciudad_origen_id = co.id
          JOIN ciudades cd ON r.ciudad_destino_id = cd.id
        `, callback);
      },

    crear: (origenId, destinoId, distancia, estado, callback) => {
        db.query(`
          INSERT INTO rutas (ciudad_origen_id, ciudad_destino_id, distancia, estado)
          VALUES (?, ?, ?, ?)`,
          [origenId, destinoId, distancia, estado], callback
        );
      },

    eliminar: (id, callback) => {
        db.query('DELETE FROM rutas WHERE id = ?', [id], callback);
      },
    
    actualizar: (id, origenId, destinoId, distancia, estado, callback) => {
        console.log("Ejecutando actualización SQL:", { origenId, destinoId, distancia, estado, id });
        db.query(`
          UPDATE rutas
          SET ciudad_origen_id = ?, ciudad_destino_id = ?, distancia = ?, estado = ?
          WHERE id = ?`,
          [origenId, destinoId, distancia, estado, id], callback
        );
      }
      
};

module.exports = Ruta;