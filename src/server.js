import 'dotenv/config';
import app from './app.js';
/* eslint-disable no-console */
import { connectDB } from '#database/connection.js';


(async () => {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}\n visit: http://localhost:${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error al iniciar el servidor:', err);
    });
})();