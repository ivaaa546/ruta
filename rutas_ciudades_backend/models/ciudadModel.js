const db= require('../config/db');

const Ciudad={
    obtenerTodas: (callback) => {
        db.query('SELECT * FROM ciudades', callback);
      },
    
      crear: (nombre, callback) => {
        db.query('INSERT INTO ciudades (nombre) VALUES (?)', [nombre], callback);
      },

      eliminar: (id, callback) => {
        db.query('DELETE FROM ciudades WHERE id = ?', [id], callback);
      },

      actualizar: (id, nombre, callback) => {
        db.query('UPDATE ciudades SET nombre = ? WHERE id = ?', [nombre, id], callback);
      }
};

module.exports=Ciudad;