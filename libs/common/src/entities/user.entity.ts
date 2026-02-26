import { Result } from "../env/result";
import { Email } from "../value-objects/email";
import { Password } from "../value-objects/password";
import { AuditableEntity } from "./auditableEntity";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export class User extends AuditableEntity{
    id?: string;
    name: string;
    email: Email;
    password?: Password;
    role: UserRole;
    

    constructor(props: Partial<User>){
        super()
        this.id = props.id;
        this.name = props.name!;
        this.email = props.email!;
        this.password = props.password;
        this.role = props.role ?? UserRole.USER;  
    }

    changeName(newName: string): Result<void>{
        if(!newName.trim()){
            return Result.fail("O nome não pode ser vazio");
        }
        this.name = newName.trim();
        return Result.ok()
    }

    changeRole(newRole: UserRole): Result<void>{
        if(!newRole){
            return Result.fail("A Role não pode ser nulo")
        }
        this.role = newRole;
        return Result.ok();
    }

    changeEmail(newEmail: Email): Result<void>{
        if(!newEmail){
            return Result.fail("O email não pode ser nulo")
        }
        this.email = newEmail;
        return Result.ok()
    }

    changePassword(newPassword: Password): Result<void>{
        if(!newPassword){
            return Result.fail("A senha não pode ser nula");
        }
        this.password = newPassword;
        return Result.ok();
    }
    
    public  getFirstName(): string{
        return this.name.split(' ')[0]
    }
}