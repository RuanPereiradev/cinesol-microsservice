import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { SERVICES_PORTS } from "y/common";
import { PaymentDto } from "y/common/dto/payment/createPayment.dto";

@Injectable()
export class PaymentService {
    private readonly paymentServiceUrl = `http://localhost:${SERVICES_PORTS.PAYMENT_SERVICE}`;

    constructor(private readonly httpService: HttpService){console.log('Catalog URL Target:', this.paymentServiceUrl);}

    async register(dto: PaymentDto){
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.paymentServiceUrl}/resgisterPayment`, dto),
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
