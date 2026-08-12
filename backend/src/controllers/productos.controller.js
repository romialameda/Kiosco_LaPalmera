/*const productos = [
    {
        id: 1,
        nombre: "Coca Cola 500ml",
        stock: 15
    },
    {
        id: 2,
        nombre: "Alfajor Jorgito",
        stock: 20
    },
    {
        id: 3,
        nombre: "Agua 500ml",
        stock: 8
    }
];
*/
const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
    const { nombre, codigo_barra } = req.query;

    try {
        let consulta = 'SELECT * FROM productos';
        let valores = [];

        if (nombre) {
            consulta += ' WHERE nombre ILIKE $1';
            valores = [`%${nombre}%`];
        }

        if (codigo_barra) {
            consulta += valores.length === 0
                ? ' WHERE codigo_barra = $1'
                : ' AND codigo_barra = $2';

            valores.push(codigo_barra);
        }

        const resultado = await pool.query(consulta, valores);

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener productos'
        });
    }
};

const crearProducto = async (req, res) => {
    // 1. Extraemos los campos que vienen del body de la petición
    const { nombre, stock, precio_venta, codigo_barra, stock_min } = req.body;

    // Validamos que el nombre exista
    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre es obligatorio"
        });
    }

    // Validamos que el stock no sea negativo
    if (stock < 0) {
        return res.status(400).json({
            mensaje: "El stock no puede ser negativo"
        });
    }

    // Validamos que el precio sea mayor a 0
    if (precio_venta <= 0) {
        return res.status(400).json({
            mensaje: "El precio de venta debe ser mayor a 0"
        });
    }

    // Validamos que el stock mínimo no sea negativo
    if (stock_min < 0) {
        return res.status(400).json({
            mensaje: "El stock mínimo no puede ser negativo"
        });
    }

    try {
        // 2. Preparamos la consulta INSERT con parámetros ($1, $2, etc.)
        const consulta = `
            INSERT INTO productos (nombre, stock, precio_venta, codigo_barra, stock_min)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const valores = [nombre, stock, precio_venta, codigo_barra, stock_min];

        // 3. Ejecutamos la consulta en la BD
        const resultado = await pool.query(consulta, valores);

        // 4. Devolvemos el producto recién creado
        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
};

const modificarProducto = async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, stock, precio_venta } = req.body;

    // Validamos el nombre
    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre es obligatorio"
        });
    }

    // Validamos el stock
    if (stock < 0) {
        return res.status(400).json({
            mensaje: "El stock no puede ser negativo"
        });
    }

    // Validamos el precio
    if (precio_venta <= 0) {
        return res.status(400).json({
            mensaje: "El precio de venta debe ser mayor a 0"
        });
    }

    try {
        const consulta = `
            UPDATE productos
            SET nombre = $1, stock = $2, precio_venta = $3
            WHERE id = $4
            RETURNING *;
        `;

        const valores = [nombre, stock, precio_venta, id];

        const resultado = await pool.query(consulta, valores);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });
    }
};

const eliminarProducto = async (req, res) => {
    // 1. Tomamos el ID de la URL
    const id = Number(req.params.id);

    try {
        // 2. Preparamos la consulta para borrar
        const consulta = `
            DELETE FROM productos
            WHERE id = $1
            RETURNING *;
        `;

        // 3. Ejecutamos la consulta pasándole el ID en el arreglo de valores
        const resultado = await pool.query(consulta, [id]);

        // 4. Si no afectó ninguna fila, el producto no existía
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // 5. Devolvemos el producto que fue eliminado
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto,
    modificarProducto,
    eliminarProducto
};