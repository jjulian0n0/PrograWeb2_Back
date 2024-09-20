const express = require('express');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



//                                  |||| ----       POST crear video      ---- |||||
    router.post("/", async (req, res) => {
        const { nombre, ruta, userId, fBaja } = req.body;

        try {
            //Crear un nuevo video en la base de datos
            //Aqui no incluyo la fechaAlta porque se manda en automatico cuando se crea con la funcion now() de prisma
            const newVideo = await prisma.video.create({
                data: {
                    nombre: nombre,
                    ruta: ruta,
                    userId: userId,
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
        const { id, nombre, ruta, fBaja } = req.body;

        try {
            await prisma.video.update({
                where: {
                    id: id
                },
                data: {
                    nombre: nombre,
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