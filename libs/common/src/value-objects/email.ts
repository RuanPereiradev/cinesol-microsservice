// libs/common/src/value-objects/email.vo.ts
import { Result } from "../env/result";

export class Email {
  private readonly _value: string;

  private constructor(email: string) {
    this._value = email;
  }

  public static create(email: string): Result<Email> {
    if (!email || !this.validate(email)) {
      return Result.fail("Formato de e-mail inválido.");
    }

    return Result.ok(new Email(email.toLowerCase().trim()));
  }

  private static validate(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  get value(): string {
    return this._value;
  }
}