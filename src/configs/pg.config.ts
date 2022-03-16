import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { getConfigService } from '../helpers/config.helper';

export const getPgPool = (configService: ConfigService): Pool => {
	return new Pool({
		host: getConfigService<string>(configService, 'POSTGRES_HOST'),
		port: getConfigService<number>(configService, 'POSTGRES_PORT'),
		user: getConfigService<string>(configService, 'POSTGRES_USER'),
		password: getConfigService<string>(configService, 'POSTGRES_PASSWORD'),
		database: getConfigService<string>(configService, 'POSTGRES_DB'),
	});
};
