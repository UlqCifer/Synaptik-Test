import { CarPeristedEntity } from '../entities/car.entity';

export class GetAvailableCarsByPeriodRequest {
	dateFrom: string;
	dateTo: string;
}

export class GetAvailableCarsByPeriodResponse {
	availableCars: CarPeristedEntity[];
}
