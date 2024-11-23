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
    cb(null, 'uploads/fotos/'); //Si no existe la crea anterior '../uploads/fotos/'
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
        data: {
          nombre,
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
  
  
      res.status(200).json('User editado'); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'User no encontrado' });
    }
  });


//                                  |||| ----       POST subscribe user      ---- |||||
router.post('/subscribe', async (req, res) => {

    //Le mandamos el usuario en sesion y el id del canal(usuario) al que quiere suscribirse
    const { usuarioId, canalId } = req.body; 

    /*
    Ejemplo de como pasar los ids
    
    {
      "usuarioId": 7,
      "canalId": 8
    } 
    */

    try {

      await prisma.user.update({
          where: { id: usuarioId },
          data: { suscripciones: { connect: [{ id: canalId }] } }
      });

      await prisma.user.update({
        where: { id: canalId },
        data: { suscriptores: { connect: [{ id: usuarioId }] } }
      });

      res.status(201).json('Nueva Suscripcion hecha');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en suscripcion' });
    }
});

//                                  |||| ----       POST Unsubscribe user      ---- |||||
router.post('/unsubscribe', async (req, res) => {

  //Le mandamos el usuario en sesion y el id del canal(usuario) del que quiere eliminar la suscripcion
  const { usuarioId, canalId } = req.body; 

  try {

    await prisma.user.update({
        where: { id: usuarioId },
        data: { suscripciones: { disconnect: [{ id: canalId }] } }
    });

    await prisma.user.update({
      where: { id: canalId },
      data: { suscriptores: { disconnect: [{ id: usuarioId }] } }
    });

    res.status(200).json('Suscripcion cancelada');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cancelar suscripcion' });
  }
});

//                                  |||| ----       GET Suscripcion      ---- |||||
router.get('/subscription', async (req, res) => {
  const { usuarioId, canalId } = req.query;

  try {

    //Este query devuelve la lista de suscripciones de un usuario
    const lista = await prisma.user.findUnique({
        where: { id: Number(usuarioId) },
        select: { suscripciones: true }
    });

    //Lo que se devolvera en este endpoint es si el usuario esta o no suscrito al canal
    if (lista) {
      let estaSuscrito = false;
      for (let i=0; i < lista.suscripciones.length; i++) {
        const element = lista.suscripciones[i];
        if(element.id == canalId) {
          estaSuscrito = true;
        }
      }
      if(estaSuscrito) {
        res.status(200).json({ res: 'Esta suscrito'});
      } else {
        res.status(200).json({ res: 'No esta suscrito'});
      }
      
    } else {
      res.status(200).json({ error: 'Suscripciones no encontradas' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener suscripciones' });
  }
});

//                                  |||| ----       GET Total Suscriptores      ---- |||||
router.get('/subscribers/:canalId', async (req, res) => {
  const { canalId } = req.params;

  try {

    //Este query devuelve el total de suscriptores de un canal
    //Para acceder al resultado en el front seria por ejemplo "data._count.suscriptores"
    //Donde 'data' es la respuesta al llamado con el metodo fetch del lado del front
    const totalSuscriptores = await prisma.user.findUnique({
        where: { id: Number(canalId) },
        select: {
          _count: {
            select: { suscriptores: true }
          }
        }
    });

    if (!totalSuscriptores) {
      return res.status(404).json({ _count: { suscriptores: 0 } });
    }

    res.status(200).json(totalSuscriptores);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener total de suscriptores' });
  }
});


//                                  |||| ----       GET Videos de Suscripciones      ---- |||||
router.get('/videos-sus/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Obtener los canales a los que el usuario está suscrito
    const suscripciones = await prisma.user.findUnique({
      where: { id: Number(usuarioId) },
      select: {
        suscripciones: {
          select: {
            id: true, // Para obtener el ID de los canales
            videos: { // Obtener los videos de cada canal
              select: {
                id: true,
                nombre: true,
                desc: true,
                ruta: true,
                fAlta: true,
              }
            }
          }
        }
      }
    });

    // Validar si el usuario tiene suscripciones
    if (!suscripciones || suscripciones.suscripciones.length === 0) {
      return res.status(404).json({ message: 'El usuario no tiene suscripciones.' });
    }

    // Extraer los videos de las suscripciones
    const videos = suscripciones.suscripciones.flatMap(canal => canal.videos);

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los videos de las suscripciones' });
  }
});


module.exports = router;  // Exportar el router