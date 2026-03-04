import { DatabaseService } from "y/database";
import { PrismaBookingRepository } from "../../repositories/prisma/prismaBooking.repository";
import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { CreateBookingUseCase } from "../../useCases/createBookingUseCase";
import { CreateBookingDto } from "y/common/dto/booking/createBooking.dto";

@Controller()
export class BookingServiceController{
    constructor(private readonly createBookingUseCase: CreateBookingUseCase){}

    @Post('register')
    async create(@Body() createBookingDto: CreateBookingDto){
        const result = await this.createBookingUseCase.execute(createBookingDto);

        //se a regra falhar lança erro http 400
        if(result.isFailure){
            throw new HttpException({
                message: result.getError(),
                statusCode: HttpStatus.BAD_REQUEST,

            }, HttpStatus.BAD_REQUEST);
        }

        return {
            message: "Reserva criado com sucesso! você tem 10 minutos para pagar",
            data: result.getValue()
        }
    }
}