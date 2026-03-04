import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { TicketType } from "apps/booking-service/src/domain/entities/ticket";
import { firstValueFrom } from "rxjs";
import { SERVICES, SERVICES_PORTS } from "y/common";
import { CreateBookingDto } from "y/common/dto/booking/createBooking.dto";

@Injectable()
export class BookingService {
    private readonly bookingServiceUrl = `http://localhost:${SERVICES_PORTS.BOOKING_SERVICE}`;

    constructor(private readonly httpService: HttpService){}

    async register(data: CreateBookingDto){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.bookingServiceUrl}/register`, data),
            );
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }
    private handleError(error: any): never {
        if(error.response){
            throw new HttpException(error.response.data, error.response.status)
        }
            throw new HttpException('Something went wrong', 503);
    }
}