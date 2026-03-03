import { AuditableEntity } from "y/common/entities/auditableEntity";

//seatId, price, type
export type TicketType = 'MEIA' | 'INTEIRA';

export class Ticket extends AuditableEntity {
    public readonly id?: string
    public readonly seatId: string;
    public readonly sessionId: string;
    public readonly price: number;
    public readonly type: TicketType;

    constructor(seatId: string, sessionId: string, price: number, type: TicketType = 'INTEIRA', id? : string){
        super();
        this.id = id;
        this.seatId = seatId;
        this.sessionId = sessionId;
        this.price = price;
        this.type = type;  
    }

    get finalPrice(): number{
        if(this.type === 'MEIA'){
            return this.price/2;
        }
        return this.price;
    }

    static createMany(seatIds: string[], sessionId: string, price: number, type: TicketType): Ticket[]{
        return seatIds.map(id => new Ticket(id, sessionId, price, type));
    }
}