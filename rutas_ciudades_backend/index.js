const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

const ciudadRoutes = require('./routes/ciudadRoutes');

const rutaRoutes = require('./routes/rutaRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
});


app.use('/api/ciudades', ciudadRoutes);
app.use('/api/rutas', rutaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});