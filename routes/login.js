const express = require('express');
const router = express.Router();  // Crear el router

// Ruta GET para mostrar el formulario de login
router.get('/', (req, res) => {
  res.json({ message: 'Formulario de login' });
});

// Ruta POST para procesar los datos del formulario de login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Validación simple (ejemplo)
  if (username === 'admin' && password === '1234') {
    res.json({ message: 'Login exitoso' });
  } else {
    res.json({ message: 'Credenciales inválidas' });
  }
});

module.exports = router;  // Exportar el router
