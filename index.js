const express = require('express');
const loginRouter = require('./routes/login');  // Importar el router de login

const app = express();
const PORT = 3000;

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Para utilizar las funciones json
app.use(express.json());

// Usar la ruta del loginRouter para cuando mandemos llamar
// localhost /login
app.use('/login', loginRouter);

// Agregar usuario con los dato que mandamos al Body:

// NUEVO USER 
app.post('/user', async (req, res) => {
  const { nombre, email, contrasena, foto, fBaja } = req.body; //Los obtenemos del JSON 

  try {
    // Crear un nuevo usuario en la base de datos
    // Funcion await para que nuestra funcion async no explote si se tarda
    /*  Escribimos esto en el JSON para que funcione, foto y baja no son necesarios, de hecho la baja se queda NULL hasta que el user se dé de baja
    {
      "nombre": "Juan Perez",
      "email": "juan.perez@example.com",
      "contrasena": "supersecreto",
      "foto": "https://example.com/fotos/juan.jpg",
      "fBaja": "2024-09-20"
    }
    
    
    
    
    */
    const newUser = await prisma.user.create({
      data: {
        nombre: nombre,
        email: email,
        contrasena: contrasena,
        foto: foto || null, // Si no se envía foto, guardamos null
        fBaja: fBaja ? new Date(fBaja) : null // Si no se envía fBaja, guardamos null
      },
    });

    res.status(201).json(newUser); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

//                                              FUNCION LOGIN
app.post('/login0', async (req, res) => {
  const { email, contrasena } = req.body; //Los obtenemos del JSON 

  try {
    
    const newUser = await prisma.user.findUnique({
      where: {
        email : email,
        contrasena : contrasena

      },
    });


    res.status(201).json('User encontrado'); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User no encontrado' });
  }
});


//                                              Editar usuario
app.post('/alterUser', async (req, res) => {
  const { id, nombre , contrasena, foto, fBaja } = req.body; //Los obtenemos del JSON 

  try {
    
    const newUser = await prisma.user.update({
      where: {
        id : id

      },
      data: {
        nombre: nombre,
        contrasena: contrasena,
        foto: foto || null, // Si no se envía foto, guardamos null
        fBaja: fBaja ? new Date(fBaja) : null

      }
    });


    res.status(201).json('User editado'); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User no encontrado' });
  }
});


//Cada que inicializo mi puerto con npm start*
app.listen(PORT, () => { //En el package.json hicimos que npm start funcionara como npm index.js, en la parte de   "scripts"
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
