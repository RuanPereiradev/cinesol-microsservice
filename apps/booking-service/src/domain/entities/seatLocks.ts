import { AuditableEntity } from "y/common/entities/auditableEntity";

//id, seatId, sessionId, userId, expiresAt
export class SeatLocks extends AuditableEntity { 
    public readonly id?: string;
    public readonly userId: string;
    public readonly seatId: string;
    public readonly sessionId: string;
    public readonly expiresAt: Date;

   constructor(userId: string, seatId: string, sessionId: string, expiresAt: Date, id?: string){
    super();
    if (!userId || !seatId || !sessionId) {
        throw new Error("Dados obrigatórios para o bloqueio de assento estão faltando.");
    }
    this.id = id;
    this.userId = userId;
    this.seatId = seatId;
    this.sessionId = sessionId;
    this.expiresAt = expiresAt;
   }

    isExpired(): boolean{
        return new Date() > this.expiresAt
    }
    static createBatch(userId: string, seatId: string[], sessionId: string, durationMinutes: number = 10): SeatLocks[] {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);

        return seatId.map(id => new SeatLocks(userId, id, sessionId, expiresAt));
    }}