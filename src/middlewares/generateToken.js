import jwt from 'jsonwebtoken';

export function generateToken(){
  return (req, res, next) => {
    const { email, role } = req.body; // Asegúrate de que el usuario esté disponible en req.body

    if (!email || !role) res.status(400).json({ error: 'Email and role are required to generate token' });
    if (!['user', 'admin'].includes(role)) res.status(400).json({ error: 'Role must be either user or admin' });

    const payload = { email, role };

    try {
      //                     Payload,        Secret,          Opciones (expiración, etc.)
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      req.token = token; // Almacena el token en la solicitud para que pueda ser utilizado por otros middlewares o controladores
      next(); // Continúa con el siguiente middleware o controlador
    } catch (_error) {
      // console.error('Error generating token:', _error);
      res.status(500).json({ error: 'An error occurred while generating the token' });
    }
  };
};