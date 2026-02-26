import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CreateMovieDto } from "y/common/dto/catalog";
import { MovieStatus } from "@prisma/client";

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
}