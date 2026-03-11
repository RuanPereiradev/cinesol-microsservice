import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request)

        if(!token){
            throw new UnauthorizedException('Token não encontrado');
        }

        try {
            const secret = process.env.JWT_SECRET
            
            const payload = await this.jwtService.verifyAsync(token, {
                secret: secret,
            });

            request['user'] = payload;
        } catch (error) {
            console.error("DETALHE DO ERRO JWT:", error.message); // <--- OLHE O TERMINAL AQUI
            throw new UnauthorizedException('Token inválido ou expirado');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
    // Acessando como chave de objeto para o TS não reclamar
    const authHeader = request.headers['authorization']; 
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}
}