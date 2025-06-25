import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const register = async (username: string, email: string, password: string): Promise<IUser> => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('El usuario o email ya existe');
  }

  const user = new User({ username, email, password });
  await user.save();
  return user;
};

export const login = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new Error('Contraseña incorrecta');
  }

  const token = generateToken(user);
  return { user, token };
}; 