
import mongoose from 'mongoose';

const connectDB = async () => {
  const uris = [
    { name: 'MongoDB Atlas (SRV)', uri: process.env.DB_URL },
    { name: 'MongoDB Atlas (No SRV)', uri: process.env.DB_URL2 },
    { name: 'MongoDB Local', uri: process.env.DB_URL_LOCAL },
  ].filter((connection) => connection.uri);

  for (const { name, uri } of uris) {
    try {
      await mongoose.connect(uri);
      console.log(`Conectado a ${name}`);
      return;
    } catch (error) {
      console.warn(`Fallo al conectar a ${name}: ${error.message}`);
    }
  }

  // console.error('No se pudo conectar a ninguna base de datos, verifica las cadenas de conexion en el archivo .env');
  process.exit(1);
};

export { connectDB };