const express = require('express');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//                                  |||| ----       Nueva Playlist      ---- |||||

      router.post('/', async (req, res) => {
             const { userId, nombre, descripcion, status } = req.body; 
             /* Escribimos esto en el JSON para que funcione:
             {
             "userId": 1,
             "nombre": "MUSICA ROCK",
             "descripcion": "MI COLECCION DE MUSICA DE ROOOOOCK.",
             "status": "Activo"
             }
            */
             try {
               const newPlaylist = await prisma.playlist.create({
                 data: {
                   userId: userId,
                   nombre: nombre,
                   descripcion: descripcion || null, 
                   status: status || 'Activo' 
                 },
               });
           
               res.status(201).json(newPlaylist); 
             } catch (error) {
               console.error(error);
               res.status(500).json({ error: 'Error al crear la playlist' });
             }
      });
      
      


//                                  |||| ----       Agregar video a la PL      ---- |||||

      router.post('/content', async (req, res) => {
            const { playlistId, videoId, status } = req.body; 
            /* Escribimos esto en el JSON para que funcione:
            {
              "playlistId": 1
            }
            */
            try {
              const newPlaylistContent = await prisma.playlistContent.create({
                data: {
                  playlistId: playlistId,
                  videoId: videoId,
                  status: status || 'Activo' 
                },
              });
          
              res.status(201).json(newPlaylistContent); 
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Error al crear el contenido de la playlist' });
            }
      });




//                                  |||| ----       Obtener videos de la PL      ---- |||||

      router.get('/', async (req, res) => {
        const { playlistId } = req.body; 
        /* Escribimos esto en el JSON para que funcione:
        {
          "playlistId": 1,
          "videoId": 1,
          "status": "Activo"
        }
        */
        try {
          const allPlaylistContent = await prisma.playlistContent.findMany({
            where: {
                playlistId: playlistId
            },
          });
      
          res.status(201).json({
            message: "Playlist obtenida",
            data: allPlaylistContent
        }); 
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener PlayList' });
        }
  });

  
module.exports = router;  // Exportar el router