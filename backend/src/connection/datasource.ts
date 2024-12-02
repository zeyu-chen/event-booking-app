import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Artist,
  Booking,
  Event,
  Review,
  Ticket,
  User,
  Venue,
} from '../types/types.js';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'password',
  database: 'events',
  entities: [Event, Booking, Ticket, User, Venue, Artist, Review],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => console.log(error));
