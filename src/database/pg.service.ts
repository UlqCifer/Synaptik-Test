import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { addDays, format, startOfMonth } from 'date-fns';
import { Pool, QueryResult } from 'pg';
import { CarPeristedEntity } from '../entities/car.entity';
import { RentEntity } from '../entities/rent.entity';
import { PG_POOL } from '../constants/pg.constants';
import { IRentReport } from './pg.interfaces';

@Injectable()
export class PgService implements OnApplicationBootstrap {
	private readonly logger = new Logger(PgService.name);
	constructor(@Inject(PG_POOL) private pgPool: Pool) {}
	async onApplicationBootstrap() {
		// await this.createCarsTable();
		// await this.createRentedCarsTable();
		// await this.saveRent({
		// 	carId: 1,
		// 	clientId: 1,
		// 	dateFrom: new Date(),
		// 	dateTo: addDays(new Date(), 3),
		// 	price: 999,
		// });
		// await this.getRentedCarsMonthReport(new Date());
		// const r = await this.getAvailableCarsByPeriod(new Date(), addDays(new Date(), 10));
		// console.debug(r);
	}

	public async createRentedCarsTable() {
		this.executeQuery(`CREATE TABLE rentedcars (
							id bigserial primary key,
							car_id bigserial NOT NULL,
							client_id bigserial NOT NULL,
							date_from date NOT NULL,
							date_to date NOT NULL,
							price numeric NOT NULL
						);`);
	}

	public async createCarsTable() {
		this.executeQuery(`CREATE TABLE cars (
							id bigserial primary key
						);`);
	}

	public async saveRent(rent: RentEntity) {
		this.executeQuery(`
		INSERT INTO rentedcars (car_id, client_id, date_from, date_to, price) 
		VALUES (${rent.carId}, 
			${rent.clientId}, 
			'${this.formatDate(rent.dateFrom)}', 
			'${this.formatDate(rent.dateTo)}', 
			${rent.price})
		`);
	}

	public async getAvailableCarsByPeriod(dateFrom: Date, dateTo: Date): Promise<CarPeristedEntity[]> {
		return this.executeQuery<CarPeristedEntity>(`
		SELECT cars.id AS id FROM cars
		LEFT JOIN rentedcars rent
			ON cars.id = rent.car_id
			AND (rent.date_from, rent.date_to) OVERLAPS ('${this.formatDate(dateFrom)}', 
			'${this.formatDate(dateTo)}')
		WHERE rent.car_id IS NULL
`);
	}

	public async getRentedCarsMonthReport(date: Date): Promise<IRentReport[]> {
		return this.executeQuery<IRentReport>(
			`
		SELECT cars.id AS CarId,
			sum(CASE
				WHEN (
							DATE_TRUNC('month', rent.date_from) = $1::date
						AND DATE_TRUNC('month', rent.date_to) = $1::date
					) THEN rent.date_to - rent.date_from + 1
				WHEN DATE_TRUNC('month', rent.date_from) = $1::date THEN (date_trunc('month', now()) + interval '1 month - 1 day')::date - rent.date_from + 1
				WHEN DATE_TRUNC('month', rent.date_to) = $1::date THEN $1::date - rent.date_to + 1
				ELSE 0
				END) as count
		FROM cars
				LEFT JOIN rentedcars rent ON
					cars.id = rent.car_id
				AND (
								DATE_TRUNC('month', rent.date_from) = $1::date
							OR DATE_TRUNC('month', rent.date_to) = $1::date)
		GROUP BY CarId
		ORDER BY CarId`,
			[this.formatDate(startOfMonth(date))]
		);
	}

	private async executeQuery<T>(queryText: string, values: any[] = []): Promise<T[]> {
		this.logger.debug(`Executing query: ${queryText}`);
		return this.pgPool.query<T>(queryText, values).then((result: QueryResult) => {
			this.logger.debug(`Executed query, result size ${result.rows.length}`);
			return result.rows;
		});
	}

	private formatDate(date: Date): string {
		return format(date, 'yyyy-MM-dd');
	}
}
