import { ConfigService } from '@nestjs/config';
import { getConfigService } from '../helpers/config.helper';

export const getRentConfig = (configService: ConfigService): IRentConfig => ({
	rentBlockDays: getConfigService<number>(configService, 'RENT_BLOCK_DAYS'),
	defaultPrice: getConfigService<number>(configService, 'RENT_DEFAULT_PRICE'),
	rentMaxDays: getConfigService<number>(configService, 'RENT_MAX_DAYS'),
});

export interface IRentConfig {
	rentBlockDays: number;
	defaultPrice: number;
	rentMaxDays: number;
}
