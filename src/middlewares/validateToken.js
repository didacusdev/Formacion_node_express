import jwt from 'jsonwebtoken';

export function validateAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraemos el token del encabezado Authorization

  // ¿Por que hacemos split(' ')[1]? 
  // Porque el formato del encabezado Authorization es "Bearer <token>", entonces al hacer split(' ') 
  // obtenemos un array donde el primer elemento es "Bearer" y el segundo elemento es el token.
  // Por lo tanto como accedemos al indice 1 del array obtenemos el token sin el prefijo "Bearer".

  if (!token) return res.status(401).json({ error: 'Token is required' }); // Si no hay token, respondemos con un error 401 (Unauthorized)
  try {
    // Si el token esta expirado o es invalido, respondemos con un error 403 (Forbidden)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Obtenemos el campo exp del token decodificado, que es la fecha de expiración del token en formato UNIX (segundos desde 1970)
    const { exp, role } = decoded;
    const currentTime = Math.floor(Date.now() / 1000); // Obtenemos la fecha actual en formato UNIX (segundos desde 1970)
    if (exp < currentTime) return res.status(403).json({ error: 'Token has expired' }); // Si el token ha expirado, respondemos con un error 403 (Forbidden)
    if (role !== 'admin') return res.status(403).json({ error: 'Admin privileges required' }); // Si el rol no es admin, respondemos con un error 403 (Forbidden)

    req.user = decoded; // Almacenamos la información decodificada del token en req.user para que pueda ser utilizada por otros middlewares o controladores
    next(); // Continuamos con el siguiente middleware o controlador
  } catch (_error) {
    // console.error('Error validating token:', _error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};