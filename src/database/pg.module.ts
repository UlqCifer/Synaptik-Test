import { PgService } from './pg.service';
import { Module } from '@nestjs/common';
import { PG_POOL } from '../constants/pg.constants';
import { getPgPool } from '../configs/pg.config';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [],
	controllers: [],
	providers: [
		PgService,
		{
			provide: PG_POOL,
			useFactory: (configService: ConfigService) => getPgPool(configService),
			inject: [ConfigService],
		},
	],
	exports: [PgService],
})
export class PgModule {}
