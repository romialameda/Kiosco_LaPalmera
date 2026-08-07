const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const productosRoutes = require("./routes/productos.routes");

app.use("/productos", productosRoutes);

app.get("/", (req, res) => {
    res.send("¡Bienvenido al Sistema de Gestión del Kiosco La Palmera!");
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});