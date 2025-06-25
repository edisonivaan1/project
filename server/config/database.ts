import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { GameSession } from '../entities/GameSession';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../game.db'),
  synchronize: true,
  logging: true,
  entities: [User, GameSession],
  migrations: [],
  subscribers: [],
  dropSchema: true // Esto eliminará y recreará las tablas al iniciar
}); 