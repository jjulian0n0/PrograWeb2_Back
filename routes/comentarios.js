const express = require('express');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



//                                  |||| ----       POST crear user      ---- |||||
router.post('/', async (req, res) => {
    const { texto, userId, videoId } = req.body; //Los obtenemos del JSON 
  
    try {
      // Crear un nuevo usuario en la base de datos
      // Funcion await para que nuestra funcion async no explote si se tarda
      /*  Escribimos esto en el JSON para que funcione, foto y baja no son necesarios, de hecho la baja se queda NULL hasta que el user se dé de baja
      {

          "texto"  :
          "userId" :
          "videoId":
      }
      
      
      
      
      */
      const newComent = await prisma.Comentario.create({
        data: {
          texto  : texto,
          userId : userId,
          videoId: videoId,
        },
        include: {
          user: { // Incluye los datos del usuario
            select: {
              nombre: true,
              foto: true,
            },
          },
        },
      });
  
      res.status(201).json(newComent); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear comentario' });
    }
  });
  
  
//                                  |||| ----       POST update user      ---- |||||
router.post('/update', async (req, res) => {
    const { id, texto } = req.body; //Los obtenemos del JSON 
  
    try {
      
      const newUser = await prisma.comentario.update({
        where: {
          id : id
  
        },
        data: {
          texto : texto,
  
        }
      });
  
  
      res.status(201).json('Comentario editado'); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al editar' });
    }
  });



//                                  |||| ----       POST update user      ---- |||||

  router.get("/:videoId", async (req, res) => {
    const { videoId } = req.params; 

    try {
        const comentariosVideo = await prisma.comentario.findMany({
            where: {
              videoId : parseInt(videoId) 
            },
            include: {
                user: { 
                    select: {
                        nombre: true,
                        foto: true
                    }
                }
            }
        });

        res.status(201).json(comentariosVideo);
    } catch ( error ) {
        console.error(error);
        res.status(500).json({ error: 'Error al encontrar video'});
    }
});


module.exports = router;  // Exportar el router