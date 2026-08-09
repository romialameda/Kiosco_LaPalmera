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
    try {
        const resultado = await pool.query('SELECT * FROM productos');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

const crearProducto = async (req, res) => {
    // 1. Extraemos los campos que vienen del body de la petición
    const { nombre, stock, precio_venta, codigo_barra, stock_min } = req.body;

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

        // 4. Devolvemos el producto recién creado (resultado.rows[0])
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el producto' });
    }
};

const modificarProducto = async (req, res) => {
    // 1. Agarramos el id de la URL (params) y los datos del body
    const id = Number(req.params.id);
    const { nombre, stock, precio_venta } = req.body;

    try {
        // 2. Preparamos la consulta UPDATE con casilleros
        const consulta = `
            UPDATE productos
            SET nombre = $1, stock = $2, precio_venta = $3
            WHERE id = $4
            RETURNING *;
        `;
        
        // 3. Ordenamos los datos (los $1, $2, $3 son los nuevos datos y el $4 es el id del WHERE)
        const valores = [nombre, stock, precio_venta, id];

        // 4. Ejecutamos la consulta
        const resultado = await pool.query(consulta, valores);

        // 5. Si resultado.rowCount es 0, significa que no existía ningún producto con ese ID
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // 6. Si lo encontró y lo modificó, devolvemos la fila actualizada
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
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