-- Crear la base de datos
CREATE DATABASE rutas_ciudades;
USE rutas_ciudades;

CREATE TABLE ciudades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ciudad_origen_id INT NOT NULL,
    ciudad_destino_id INT NOT NULL,
    distancia FLOAT NOT NULL CHECK (distancia > 0),
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    
    FOREIGN KEY (ciudad_origen_id) REFERENCES ciudades(id) ON DELETE CASCADE,
    FOREIGN KEY (ciudad_destino_id) REFERENCES ciudades(id) ON DELETE CASCADE,
    
    CONSTRAINT ruta_unica UNIQUE (ciudad_origen_id, ciudad_destino_id),
    CHECK (ciudad_origen_id <> ciudad_destino_id)
);
