export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export class User {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date; 

    constructor(props: Partial<User>){
        this.id = props.id;
        this.name = props.name!;
        this.email = props.email!;
        this.password = props.password;
        this.role = props.role ?? UserRole.USER;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    public  getFirstName(): string{
        return this.name.split(' ')[0]
    }
}