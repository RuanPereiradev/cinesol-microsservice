import { Result } from "../env/result";
import * as bcrypt from 'bcrypt';

export class Password{

    private readonly _value: string;
    private readonly _isHashed: boolean;
    
    private constructor(password: string, isHashed: boolean = false){
        this._value = password;
        this._isHashed = isHashed
    }

    public static create(password: string): Result<Password>{
        if(!password || password.length < 8){
            return Result.fail("A senha deve ter no mínimo 8 caracteres");
        }
        return Result.ok(new Password(password, false));
    }

    public static createFromHash(hash: string): Password{
        return new Password(hash, true);
    }

    public async toHash(): Promise<string> {
        if(this._isHashed) return this._value;
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(this._value, salt);
    }

    public async compare(plainText: string): Promise<boolean> { 
        if(!this._isHashed) return false;
        return bcrypt.compare(plainText, this._value);
    }

    get value(): string {
        return this._value;
    }

}