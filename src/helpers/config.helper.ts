import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function getConfigService<T>(configService: ConfigService, configName: string): T {
	const logger = new Logger('configs');
	const configValue = configService.get<T>(configName);
	if (!configValue) {
		logger.error(`Неудалось получить значение .env настроек: ${configName}`);
		throw new Error(`Неудалось получить значение .env настроек: ${configName}`);
	}
	return configValue;
}
