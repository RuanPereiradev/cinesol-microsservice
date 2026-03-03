import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CreateAditoriumDto, CreateMovieDto } from "y/common/dto/catalog";
import { MovieStatus } from "@prisma/client";
import { CreateSessionDto } from "y/common/dto/catalog/createSession.dto";

@Controller('movie')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService){}

    @Post('registerMovie')
    async register(@Body() dto: CreateMovieDto){
        return this.catalogService.register(dto);
    }

    @Get('all')
    async findAll(@Query('status') status?: MovieStatus){
        return this.catalogService.findAll(status)
    }
    
    @Get(':id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.catalogService.findOne(id)
    }

    @Post('auditorium')
    async createAuditorium(@Body() dto: CreateAditoriumDto) {
        return this.catalogService.createAuditorium(dto);
    }
    
    @Post('session')
      async createSession(@Body() dto: CreateSessionDto) {
        return this.catalogService.createSession(dto);
      }
    @Get('session/:id/seats')
    async getSessionSeats(@Param('id', ParseUUIDPipe) sessionId: string){
    return this.catalogService.getSessionSeats(sessionId)
  }

}