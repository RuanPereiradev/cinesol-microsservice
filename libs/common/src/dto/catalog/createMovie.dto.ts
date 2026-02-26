import { MovieStatus } from "@prisma/client";
import { IsNotEmpty, IsString, IsInt, IsUrl, IsArray, IsEnum } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title : string;

    @IsString()
    @IsNotEmpty({ message: 'synopsis is required' })
    synopsis : string;

    @IsInt()
    durationMinutes: number;

    @IsUrl()
    posterUrl: string;

    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @IsEnum(MovieStatus)
    status: MovieStatus;


}