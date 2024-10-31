const express = require('express');
const multer = require('multer'); //Videos
const path = require('path'); //Para la url del video

const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Copia de fotos multer pero para video
const storage = multer.diskStorage({ //En caso de que omitas el objeto con las opciones, los archivos serán guardados en la memoria y nunca serán escritos en el disco.
    destination: (req, file, cb) => {
      cb(null, 'uploads/videos/'); //Si no existe la crea anterior '../uploads/fotos/'
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); //Le asignamso un nuevo nombre
    }
  });

  //

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4'];  // Se puede sin el if Lol
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Debe ser mp4.'), false);
    }
  };
  
  const uploadVideo = multer({ 
    storage: storage,
    fileFilter: fileFilter
  });











//                                  |||| ----       POST crear video      ---- |||||
    router.post("/", uploadVideo.single('ruta') , async (req, res) => {
        const { nombre, desc, userId, fBaja } = req.body;

        const ruta = req.file ? req.file.path : null;

        try {
            //Crear un nuevo video en la base de datos
            //Aqui no incluyo la fechaAlta porque se manda en automatico cuando se crea con la funcion now() de prisma
            const newVideo = await prisma.video.create({
                data: {
                    nombre: nombre,
                    desc: desc,
                    ruta: ruta,
                    userId: Number(userId),
                    fBaja: fBaja ? new Date(fBaja) : null
                },
            });

            res.status(201).json(newVideo);
        } catch ( error ) {
            console.error(error);
            res.status(500).json({ error: 'Error al subir el video'});
        }
    });




//                                  |||| ----       PUT modificar video      ---- |||||
    router.put("/update", async (req, res) => {
        const { id, nombre, desc, ruta, fBaja } = req.body;

        try {
            await prisma.video.update({
                where: {
                    id: id
                },
                data: {
                    nombre: nombre,
                    desc: desc,
                    ruta: ruta,
                    fBaja: fBaja ? new Date(fBaja) : null
                },
            });

            res.status(201).json('Video editado');
        } catch ( error ) {
            console.error(error);
            res.status(500).json({ error: 'Error al editar datos del video'});
        }
    });


//                                  |||| ----       GET un video por ID      ---- |||||

    router.get("/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const video = await prisma.video.findUnique({
                where: {
                    id: Number(id)
                },
            });

            if (video) {
                res.status(200).json(video); // Usa 200 para respuestas exitosas
            } else {
                res.status(404).json({ error: 'Video no encontrado' });
            }

        } catch ( error ) {
            console.error(error);
            res.status(500).json({ error: 'Error al encontrar video'});
        }
    });
//

router.get("/", async (req, res) => {
    const { id} = req.body;

    try {
        const video = await prisma.video.findUnique({
            where: {
                id: id
            },
        });

        res.status(201).json(video);
    } catch ( error ) {
        console.error(error);
        res.status(500).json({ error: 'Error al encontrar video'});
    }
});


//                                  |||| ----       GET busca videos que contengan en su nombre el string name      ---- |||||

    router.get("/busqueda", async (req, res) => {
        const {name} = req.body;

        try {
            const video = await prisma.video.findMany({
                where: {
                    nombre: {
                        contains : name,
                        mode: "insensitive" //ingora mayusculas y minusculas
                    },
                },
            });

            res.status(201).json(video);
        } catch ( error ) {
            console.error(error);
            res.status(500).json({ error: 'Error al encontrar video'});
        }
    });



module.exports = router;  // Exportar el router