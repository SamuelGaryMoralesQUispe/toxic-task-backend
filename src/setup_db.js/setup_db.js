const fs = require('fs');
const path = require('path');
const { query } = require('./config/database');

async function initDatabase() {
  const sqlFiles = [
    '01_esquema_original.sql',
    '02_ajustes.sql',
    '03_extra_y_datos_iniciales.sql',
    '04_seed_users.sql'
  ];

  console.log('--- Iniciando construcción de la Base de Datos ---');

  for (const file of sqlFiles) {
    const filePath = path.join(__dirname, '../database', file);
    if (fs.existsSync(filePath)) {
      console.log(`Ejecutando: ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      try {
        await query(sql);
        console.log(`✓ ${file} ejecutado con éxito.`);
      } catch (err) {
        console.error(`Error en ${file}:`, err.message);
      }
    } else {
      console.warn(`Archivo no encontrado: ${file}`);
    }
  }

  console.log('--- Base de datos lista con tablas y 50 usuarios ---');
  process.exit();
}

initDatabase();