const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("¡Bienvenido al Sistema de Gestión del Kiosco La Palmera!");
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});