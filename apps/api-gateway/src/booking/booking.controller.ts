import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "y/common/dto/booking/createBooking.dto";
import { CurrentUser } from "y/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "y/common/guards/jwtAuthGuards";

@Controller('booking')
export class BookingController{
    constructor(private readonly bookingService: BookingService){}

    @UseGuards(JwtAuthGuard)
    @Post('register')
    async create(@Body() createBookingDto: Omit<CreateBookingDto,'userId'>,
           @CurrentUser() user: any,
           @Req() req: Request
    ){
        const token = req.headers['authorization']; // Aqui está o "Bearer eyJ..."
        const requestWithUser = {
            ...createBookingDto,
            userId: user.sub || user.userId || user.id
        }

        const result = await this.bookingService.register(requestWithUser, token)
       
        return result;
    }

}