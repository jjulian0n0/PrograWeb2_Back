const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//fotos multer

const storage = multer.diskStorage({ //En caso de que omitas el objeto con las opciones, los archivos serán guardados en la memoria y nunca serán escritos en el disco.
  destination: (req, file, cb) => {
    cb(null, '../uploads/fotos/'); //Si no existe la crea
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Le asignamso un nuevo nombre
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; 
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Debe ser JPG o PNG.'), false);
  }
};

const uploadFoto = multer({ 
  storage: storage,
  fileFilter: fileFilter
});



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