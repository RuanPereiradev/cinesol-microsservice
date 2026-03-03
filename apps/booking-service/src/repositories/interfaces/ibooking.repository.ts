import { OrderStatus } from "@prisma/client";
import { Booking } from "../../domain/entities/booking";
import { BookingProducts } from "../../domain/entities/bookingProducts";
import { SeatLocks } from "../../domain/entities/seatLocks";
import { Ticket } from "../../domain/entities/ticket";

export interface IBookingRepository{
    create(booking: Booking, tickets: Ticket[], products: BookingProducts[], locks: SeatLocks[]): Promise<Booking>;
    checkAvailability(sessionId: string, seatId: string[]): Promise<boolean>;
    updateStatus(id: string, status: string): Promise<void>
    // findAll(): Promise<Booking[]>;
    findById(id: string): Promise<Booking | null>
    findPedingOrders(): Promise<Booking[] | null>
}