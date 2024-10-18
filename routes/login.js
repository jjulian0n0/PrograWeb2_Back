const express = require('express');
const router = express.Router();  // Crear el router

//Conectar con prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/', async (req, res) => {
  const { email, contrasena } = req.body; //Los obtenemos del JSON 

  try {
    
    const newUser = await prisma.user.findUnique({
      where: {
        email : email,
        contrasena : contrasena

      },
    });


    if(newUser == null){
    res.status(500).json({ error: 'User no encontrado' });

    }else{
    res.status(200).json({userId : newUser.id})
  };

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User no encontrado' });
  }
});

module.exports = router;  // Exportar el router