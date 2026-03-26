// Express Router es una función que nos permite crear un nuevo enrutador para manejar rutas específicas de nuestra aplicación. 
// Es útil para organizar el código y separar las rutas en módulos.
import { Router } from 'express'; 

// Middlewares
import { generateToken } from '#middlewares/generateToken.js'; // Middleware para generar un token JWT
import { validateAdminToken } from '#middlewares/validateToken.js'; // Middleware para validar el token JWT y verificar que el usuario tenga privilegios de admin

// Importamos el controlador para manejar la lógica de negocio de la ruta.
import { 
  getUsers,
  postUser,
} from '#controllers/userControllers.js'; 


const router = Router(); // Creamios una nueva instancia de Router

router.get('/users', validateAdminToken, getUsers); // Configuramos la ruta para manejar las solicitudes GET a /users y llamamos al controlador getUsers
router.post('/users', generateToken(), postUser); // Configuramos la ruta para manejar las solicitudes POST a /users y llamamos al controlador postUser

export default router; // Exportamos el enrutador para poder usarlo en otros archivos (como app.js)