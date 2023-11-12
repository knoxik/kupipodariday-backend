import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password') as string,
    database: configService.get('database.name'),
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    synchronize: true,
  };
};
