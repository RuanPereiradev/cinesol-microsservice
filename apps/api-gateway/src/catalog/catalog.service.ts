import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { MovieStatus } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { SERVICES_PORTS } from 'y/common';

@Injectable()
export class CatalogService {
    private readonly catalogServiceUrl = `http://localhost:${SERVICES_PORTS.CATALOG_SERVICE }`;

    constructor(private readonly httpService: HttpService){console.log('Catalog URL Target:', this.catalogServiceUrl);}
    async register(data: { title: string; synopsis: string; durationMinutes: number; posterUrl: string; genres: string[]; status: MovieStatus}){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.catalogServiceUrl}/registerMovie`, data),
            );
            return response.data;
        } catch (error) {
            this.handleError(error)
        }
    }

    async findAll(status?: MovieStatus) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.catalogServiceUrl}/all`, { 
                    params: { status } 
                })
            );
            return response.data; // Faltou o .data aqui no seu código
        } catch (error) {
            this.handleError(error)
        }
    }

   async findOne(id: string) { 
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.catalogServiceUrl}/${id}`)
            );
            return response.data;
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