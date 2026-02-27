import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { CatalogServiceService } from './catalog-service.service';
import { CreateMovieDto } from 'y/common/dto/catalog';
import { MovieStatus } from '@prisma/client';
import { CreateAditoriumDto } from 'y/common/dto/catalog/createAuditorium.dto';
import { CreateSessionDto } from 'y/common/dto/catalog/createSession.dto';

@Controller()
export class CatalogServiceController {
  constructor(private readonly catalogServiceService: CatalogServiceService) {}

 @Get('all')
  async findAll(@Query('status') status?: MovieStatus){
    return this.catalogServiceService.findAll(status)
  }

  
  @Post('registerMovie')
  async register(@Body() dto: CreateMovieDto){
    return this.catalogServiceService.register(dto)
  }

 @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.catalogServiceService.findOne(id)
  }

  @Post('auditorium')
  async createAuditorium(@Body() dto: CreateAditoriumDto) {
    return this.catalogServiceService.createAuditorium(dto);
  }

  @Post('session')
  async createSession(@Body() dto: CreateSessionDto) {
    return this.catalogServiceService.createSession(dto);
  }


}
