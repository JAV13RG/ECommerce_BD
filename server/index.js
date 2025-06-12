const express = require('express');
const mongoose = require('mongoose'); //BD
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

//Conexion y estructura de la base de datos
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error de conexión', err));

// Test route
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

//Conexion de rutas al servidor
//Usuario
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

//Pedidos
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);