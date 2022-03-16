export class SaveRentRequest {
	carId: number;
	clientId: number;
	dateFrom: string;
	dateTo: string;
}

export class SaveRentResponse {
	success: boolean;
	errorMsg?: string;
}
