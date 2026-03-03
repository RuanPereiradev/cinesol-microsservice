import { AuditableEntity } from "y/common/entities/auditableEntity";

export class Booking  extends AuditableEntity{ 
    public readonly id?: string;
    public readonly userId: string;
    public readonly sessionId: string;
    public readonly seatIds: string[];
    public status: 'PENDING' | 'PAID' | 'CANCELLED';
    public readonly totalPrice: number;
    public readonly expiresAt: Date;


    constructor(userId: string, sessionId: string, seatIds: string[], totalPrice: number, expiresAt: Date, id?: string){
       super();
        if(!userId) throw new Error("O usuário é obrigatorio.");
        if(!sessionId) throw new Error("Sessão é obrigatória");
        if(!seatIds || seatIds.length === 0) throw new Error("Um assento deve ser selecionado");
        if(totalPrice < 0) throw new Error("O preço de um assento não pode ser negativo");

        this.id = id;
        this.userId = userId;
        this.sessionId = sessionId;
        this.seatIds = seatIds;
        this.totalPrice = totalPrice;
        this.expiresAt = expiresAt;
        this.status = 'PENDING';
    }

    canBeConfirmed(): boolean {
        return this.status === 'PENDING' && !this.isExpired() 
    }

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    markAsPaid(): void {
        if(this.isExpired()){
            throw new Error("Não é possivel realizar pagamento: Objeto expirado")
        }

        this.status = 'PAID';
    }

    cancel(): void{
        if(this.status === 'PAID'){
            throw new Error("Não é possivel realizar cancelar: Objeto pago")
        }
        this.status =  'CANCELLED';
    }
}