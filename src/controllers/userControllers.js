import argon2 from 'argon2'; // Libreria para hashing de contraseñas.
import User from '#models/userModel.js'; // Importamos el modelo de usuario para interactuar con la base de datos.


const argon2Config = {
  // Función hash que se utilizará es: argon2d. tambien dispone de argon2i o argon2id
  /*
      Argon2d: Es resistente a ataques de GPU y ASIC, ya que utiliza acceso a memoria dependiente de los datos.
      Esto significa que el patrón de acceso a la memoria depende de los datos de entrada, lo que lo hace más seguro contra ataques de hardware especializado.
      Sin embargo, es más vulnerable a ataques de canal lateral (side-channel attacks).

      Argon2i: Utiliza acceso a memoria independiente de los datos, lo que lo hace más seguro contra ataques de canal lateral.
      Sin embargo, es menos resistente a ataques de GPU y ASIC en comparación con Argon2d.

      Argon2id: Es una combinación de Argon2i y Argon2d. Primero utiliza acceso a memoria independiente de los datos (como Argon2i) y luego
      cambia a acceso a memoria dependiente de los datos (como Argon2d). Esto proporciona un equilibrio entre resistencia a ataques de canal lateral y
      ataques de hardware especializado.
  */
  type: argon2.argon2id,
  memoryCost: 65536, // Coste de memoria (2 ** 16 = 65536Kib (Kibibytes) o 64Mib (Mebibytes) RAM por hash): Es el tamaño de la memoria utilizada por la función hash
  timeCost: 8, // Número de iteraciones: Es el número de veces que se procesa la función hash
  parallelism: 2, // Grado de paralelismo: Es el número de hilos del CPU que se utilizan para procesar la función hash
  hashLength: 64, // Longitud del hash: Es la longitud de la cadena hash generada
  saltLength: 16 // Longitud de la sal: Es la longitud de la cadena de sal generada

  /*
    El hash resultante sería algo como: 
      $argon2id$v=19$m=65536,t=8,p=2$e/AY0BIWP2nDdYhc3Qii5g$QRDU4gWHitOOopXsMJVRc0DsOwNQDorF87yXiOLSC9Rkgkv86EhDbNpW1F3/cUNMhmM74zPuETEGsat3KZEiPg

      $argon2id: Identificador del algoritmo (Argon2id es el híbrido recomendado).
      v=19: Versión del algoritmo (19 es la versión actual).
      Parámetros de costo:
        m (Memory): Memoria en KiB (ej. 65536 KiB = 64 MiB).
        t (Time): Iteraciones (rondas).
        p (Parallelism): Hilos/núcleos.
  */
};


// Ejemplo: http:localhost:3000/users?page=1&limit=5
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Obtener los parámetros de paginación de la consulta

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const users = await User.paginate({}, options);
    
    if(!users || users.docs.length === 0) res.status(404).json({ error: 'No users found' });

    res.status(200).json(users);
  } 
  catch (_error) {
    // console.error('Error fetching users:', _error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};


const postUser = async (req, res) => {
  try {
    const { name, email, password, address, phone, role } = req.body;

    const hashedPassword = await argon2.hash(password, argon2Config);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address: {
        street: address?.street,
        city: address?.city,
        state: address?.state,
        zip: address?.zip,
      },
      phone,
      role,
    });

    const userSaved = await newUser.save();

    if (!userSaved) res.status(500).json({ error: 'Failed to create user' });


    res.status(201).json({ message: 'User created successfully', user: userSaved });
  } catch (_error) {
    if (_error.name === 'ValidationError') {
      const messages = Object.values(_error.errors).map((err) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }
    console.error('Error creating user:', _error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

export { getUsers, postUser };