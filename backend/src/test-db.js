const pool = require('./config/db');

async function probarConexion() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('¡Conexión exitosa a PostgreSQL! Fecha/Hora del servidor:', res.rows[0].now);
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } finally {
    pool.end(); // Cerramos la prueba
  }
}

probarConexion();