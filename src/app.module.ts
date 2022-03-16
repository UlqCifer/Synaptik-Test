import { PgModule } from './database/pg.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRentConfig } from './configs/rent.config';
import { RENT_CONFIG } from './constants/rent.constants';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PgModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: RENT_CONFIG,
			useFactory: (configService: ConfigService) => getRentConfig(configService),
			inject: [ConfigService],
		},
	],
})
export class AppModule {}
