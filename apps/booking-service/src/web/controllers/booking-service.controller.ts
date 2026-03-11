import { DatabaseService } from "y/database";
import { PrismaBookingRepository } from "../../repositories/prisma/prismaBooking.repository";
import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CreateBookingUseCase } from "../../useCases/createBookingUseCase";
import { CreateBookingDto } from "y/common/dto/booking/createBooking.dto";
import { JwtAuthGuard } from "y/common/guards/jwtAuthGuards";
import { CurrentUser } from "y/common/decorators/current-user.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class BookingServiceController{
    constructor(private readonly createBookingUseCase: CreateBookingUseCase){}

    @UseGuards(JwtAuthGuard)
    @Post('register')
    async create(
        @Body() createBookingDto: Omit<CreateBookingDto, 'userId'>,
        @CurrentUser() user: any
    ){
        console.log("Usuário logado:", user);

        const requestWithUser = {
            ...createBookingDto,
            userId: user.sub || user.userId || user.id
        }

        console.log(user.sub)
        const result = await this.createBookingUseCase.execute(requestWithUser as any);

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