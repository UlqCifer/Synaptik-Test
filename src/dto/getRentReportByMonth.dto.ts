import { IRentReport } from '../database/pg.interfaces';

export class GetRentReportByMonthRequest {
	date: string;
}

export class GetRentReportByMonthResponse {
	byCars: IRentReport[];
	total: number;
}
