const express = require("express");

const router = express.Router();

const { obtenerProductos, crearProducto, modificarProducto, eliminarProducto } = require("../controllers/productos.controller");

router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:id", modificarProducto)
router.delete("/:id", eliminarProducto)

module.exports = router;