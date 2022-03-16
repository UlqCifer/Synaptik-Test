export class RentEntity {
	id?: number;
	carId: number;
	clientId: number;
	dateFrom: Date;
	dateTo: Date;
	price: number;
}

export class RentPeristedEntity extends RentEntity {
	id: number;
}
