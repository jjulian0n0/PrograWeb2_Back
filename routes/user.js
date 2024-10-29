const express = require('express');
const multer = require('multer');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//fotos multer
const uploadFoto = multer({dest:'../uploads/fotos/'});



//                                  |||| ----       POST crear user      ---- |||||
router.post('/', uploadFoto.single('foto'), async (req, res) => {
    const { nombre, email, contrasena, fBaja } = req.body; //Los obtenemos del JSON 
  
    const foto = req.file ? req.file.path : null;

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
        data: {nombre,
          email,
          contrasena,
          foto, // Envía URL de la foto o null
          fBaja: fBaja ? new Date(fBaja) : null
        },
      });
  
      res.status(201).json(newUser); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  });
  
  
//                                  |||| ----       POST update user      ---- |||||
router.post('/update', async (req, res) => {
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



module.exports = router;  // Exportar el router