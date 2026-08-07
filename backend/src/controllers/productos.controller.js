const productos = [
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

const obtenerProductos = (req, res) => {
    res.json(productos);
};

const crearProducto = (req, res) => {
    const nuevoProducto = req.body;

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
};

const modificarProducto = (req, res) => {
    const id = Number(req.params.id);

    const producto = productos.find(producto => producto.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    producto.nombre = req.body.nombre;
    producto.stock = req.body.stock;

    res.json(producto);
};

const eliminarProducto = (req, res) => {
    const id = Number(req.params.id);
    //findIndex me devuelve la posicion del producto
    const i = productos.findIndex(producto => producto.id === id);

     if (i === -1) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }
    const productoEliminado = productos.splice(i, 1);

    res.json(productoEliminado);
}

module.exports = {
    obtenerProductos,
    crearProducto,
    modificarProducto,
    eliminarProducto
};