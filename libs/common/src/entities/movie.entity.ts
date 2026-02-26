export enum MovieStatus {
    COMING_SOON = 'COMING_SOON',
    IN_THEATERS =  'IN_THEATERS',
    FINISHED = 'FINISHED'
}

export class Movie{
    id?: string;
    title: string;
    synopsis: string;
    durationMinutes: number;
    posterUrl: string;
    genres: string[];
    status: MovieStatus;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: Partial<Movie>) {
        this.id = props.id;
        this.title = props.title!;
        this.synopsis = props.synopsis!;
        this.durationMinutes = props.durationMinutes!;
        this.posterUrl = props.posterUrl!;
        this.genres = props.genres ?? [];
        this.status = props.status ?? MovieStatus.COMING_SOON;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    public getDurationInHours(): string {
        const hours = Math.floor(this.durationMinutes / 60);
        const minutes = this.durationMinutes % 60;
        return `${hours}h ${minutes}min`;
    }

    public isAvaliableForBooking(): boolean {
        return this.status === MovieStatus.IN_THEATERS;
    }
}