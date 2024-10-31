const express = require('express');
const cors = require('cors');
const multer = require('multer');

const loginRouter = require('./routes/login');  // Importar el router de login
const userRouter = require('./routes/user');  // Importar el router de user
const videoRouter = require('./routes/video');  // Importar el router de video
const playlistRouter = require('./routes/playlist');  // Importar el router de playlist
const comentarioRouter = require('./routes/comentarios');  // Importar el router de playlist



const app = express();
const PORT = 3000;

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json()); //usar funciones JSON

app.use(cors({
  origin: 'http://localhost:5173' // Solo permite solicitudes desde este origen
}));

//Multer (las carpetas se crean solas)
const uploadFoto = multer({dest:'uploads/fotos/'});
const uploadVideo = multer({dest:'uploads/videos/'});

// Usar la ruta de los router para cuando mandemos llamar
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use('/playlist', playlistRouter);
app.use('/comentarios', comentarioRouter);

app.use('/uploads', express.static('uploads')); //Hacer publicas mis fotos


//Prueba multer
app.post/('/img/simple', uploadFoto.single('fotoPerfil', (req,res) => {

  console.log(req.file);
  res.send('fin');


}));



//Cada que inicializo mi puerto con npm start*
app.listen(PORT, () => { //En el package.json hicimos que npm start funcionara como npm index.js, en la parte de   "scripts"
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
