import { Inject, Injectable } from '@nestjs/common';
import { addDays, differenceInDays, getDay, subDays } from 'date-fns';
import { IRentConfig } from './configs/rent.config';
import { RENT_CONFIG } from './constants/rent.constants';
import { PgService } from './database/pg.service';
import { GetAvailableCarsByPeriodResponse } from './dto/getAvailableCarsByPeriod.dto';
import { GetPriceResponse } from './dto/getPrice.dto';
import { GetRentReportByMonthResponse } from './dto/getRentReportByMonth.dto';
import { SaveRentRequest, SaveRentResponse } from './dto/saveRent.dto';

@Injectable()
export class AppService {
	constructor(@Inject(RENT_CONFIG) private config: IRentConfig, private readonly dataBase: PgService) {}

	public async getAvailableCarsByPeriod(dateFrom: Date, dateTo: Date): Promise<GetAvailableCarsByPeriodResponse> {
		const result = await this.dataBase.getAvailableCarsByPeriod(
			subDays(dateFrom, this.config.rentBlockDays),
			addDays(dateTo, this.config.rentBlockDays)
		);
		return { availableCars: result };
	}

	public getPrice(dateFrom: Date, dateTo: Date): GetPriceResponse {
		let price = 0;
		const days = differenceInDays(dateFrom, dateTo);
		if (days > this.config.rentMaxDays) {
			throw new Error(`Превышен лимит аренды в ${this.config.rentMaxDays}`);
		}
		for (let i = 1; i <= days; i++) {
			if (i <= 4) {
				price = price + this.config.defaultPrice;
				continue;
			}
			if (i <= 9) {
				price = price + (this.config.defaultPrice - this.config.defaultPrice * 0.05);
				continue;
			}
			if (i <= 17) {
				price = price + (this.config.defaultPrice - this.config.defaultPrice * 0.1);
				continue;
			}
			price = price + (this.config.defaultPrice - this.config.defaultPrice * 0.15);
		}
		return { price };
	}

	public async getRentReportByMonth(date: Date): Promise<GetRentReportByMonthResponse> {
		const reportData = await this.dataBase.getRentedCarsMonthReport(date);
		let total = 0;
		reportData.forEach((x) => (total = total + x.count));
		return { byCars: reportData, total };
	}

	public async saveRent(request: SaveRentRequest): Promise<SaveRentResponse> {
		const dateFrom = new Date(request.dateFrom);
		const dateTo = new Date(request.dateTo);
		this.checkDayOfWeek(dateFrom);
		this.checkDayOfWeek(dateTo);

		const availableCars = await this.dataBase.getAvailableCarsByPeriod(dateFrom, dateTo);
		if (!availableCars.find((x) => x.id === request.carId)) {
			throw new Error(`Данная машина уже забронирована на даты входящие в период бронирования!`);
		}

		await this.dataBase.saveRent({
			carId: request.carId,
			clientId: request.clientId,
			dateFrom,
			dateTo,
			price: this.getPrice(dateFrom, dateTo).price,
		});
		return { success: true };
	}

	private checkDayOfWeek(date: Date) {
		const dayOfWeek = getDay(new Date(date));
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			throw new Error(`Дата начала или конца бронирования не может выпадать на субботу или воскресенье`);
		}
	}
}
