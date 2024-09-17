const express = require('express');
const app = express();
const loginRouter = require('./routes/login');  // Importar el router de login

const PORT = 3000;

// Para utilizar las funciones json
app.use(express.json());

// Usar la ruta del loginRouter para cuando mandemos llamar
// localhost /login
app.use('/login', loginRouter);


app.listen(PORT, () => { //En el package.json hicimos que npm start funcionara como npm index.js, en la parte de   "scripts"
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
