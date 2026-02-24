import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SERVICES_PORTS } from 'y/common';
import { HttpService } from '@nestjs/axios'; // <--- ADICIONE ESTA LINHA

@Injectable()
export class AuthService {
    private readonly authServiceUrl = `http://localhost:${SERVICES_PORTS.AUTH_SERVICE}`;

    constructor(private readonly httpService: HttpService){}
    async register(data: { email: string; password: string; name: string}){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/register`, data),
            );
            return response.data;
        } catch (error) {
            this.handleError(error)
        }
    }

      async login(data: { email: string; password: string; }){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/register`, data),
            );
            return response.data;
        } catch (error) {
            this.handleError(error)
        }
    }

    async getProfile(token: string){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/profile`, {
                    headers: { Authorization: token },
                }),
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

