import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'book-store',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;
