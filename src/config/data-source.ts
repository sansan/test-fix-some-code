import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
dotenv.config({ path: `.${environment}.env` });

const dataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION as any,
  database: process.env.TYPEORM_DATABASE,
  port: parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  host: process.env.TYPEORM_HOST,
  synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
  logging: Boolean(process.env.TYPEORM_LOGGING),
  entities: ['./src/**/*.entity{.ts,.js}'],
  subscribers: [],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
});

export default dataSource;
