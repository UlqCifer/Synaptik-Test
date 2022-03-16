import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { GetAvailableCarsByPeriodRequest, GetAvailableCarsByPeriodResponse } from './dto/getAvailableCarsByPeriod.dto';
import { GetPriceRequest, GetPriceResponse } from './dto/getPrice.dto';
import { GetRentReportByMonthRequest, GetRentReportByMonthResponse } from './dto/getRentReportByMonth.dto';
import { SaveRentRequest, SaveRentResponse } from './dto/saveRent.dto';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	// #TODO  DTO Validation + Errors

	@Get('cars')
	public async getAvailableCarsByPeriod(
		@Req() request: GetAvailableCarsByPeriodRequest
	): Promise<GetAvailableCarsByPeriodResponse> {
		return this.appService.getAvailableCarsByPeriod(new Date(request.dateFrom), new Date(request.dateTo));
	}

	@Get('price')
	public async getPrice(@Req() request: GetPriceRequest): Promise<GetPriceResponse> {
		return this.appService.getPrice(new Date(request.dateFrom), new Date(request.dateTo));
	}

	@Get('report')
	public async getRentReportByMonth(
		@Req() request: GetRentReportByMonthRequest
	): Promise<GetRentReportByMonthResponse> {
		return this.appService.getRentReportByMonth(new Date(request.date));
	}

	@Post('rent')
	public async saveRent(@Body() request: SaveRentRequest): Promise<SaveRentResponse> {
		return this.appService.saveRent(request);
	}
}
