import { AuditableEntity } from "y/common/entities/auditableEntity";

//productid, quantity, unitPrice
export class BookingProducts extends AuditableEntity {
    public readonly id?: string;
    public readonly productId: string;
    public readonly quantity: number;
    public readonly unitPrice: number

    constructor(productId: string, quantity: number, unitPrice: number, id?: string){
        super();
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    get finalPrice(): number{
        return this.unitPrice * this.quantity
    }
}