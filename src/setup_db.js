require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  const sqlFiles = [
    '01_esquema_original.sql',
    '02_ajustes.sql',
    '03_extra_y_datos_iniciales.sql',
    '04_seed_users.sql'
  ];

  console.log('--- Conectando a Neon y configurando la Base de Datos ---');
  
  const client = await pool.connect();

  for (const file of sqlFiles) {
    const filePath = path.join(__dirname, '../database', file);
    if (fs.existsSync(filePath)) {
      console.log(`Ejecutando: ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      try {
        await client.query(sql);
        console.log(`✓ ${file} ejecutado con éxito.`);
      } catch (err) {
        // Si la tabla o restricción ya existe, muestra el aviso y continúa sin detener el proceso
        console.warn(`[Aviso en ${file}]: ${err.message}`);
      }
    } else {
      console.warn(`Archivo no encontrado: ${filePath}`);
    }
  }

  console.log('--- ¡Proceso de sincronización completado! ---');
  client.release();
  await pool.end();
  process.exit();
}

initDatabase();