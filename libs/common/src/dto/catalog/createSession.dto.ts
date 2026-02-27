import { SessionAudio, SessionFormat } from "@prisma/client";
import { IsEnum, IsISO8601, IsNumber, IsUUID, Min } from "class-validator";

export class CreateSessionDto{
    @IsISO8601()
    startTime: string;

    @IsEnum(SessionAudio)
    audio: SessionAudio;

    @IsEnum(SessionFormat)
    format: SessionFormat

    @IsNumber()
    @Min(0)
    price: number;

    @IsUUID()
    movieId: string;

    @IsUUID()
    auditoriumId: string;
}