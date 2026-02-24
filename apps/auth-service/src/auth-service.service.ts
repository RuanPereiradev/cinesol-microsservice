import { ConflictException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from 'y/common/dto';
import { DatabaseService } from 'y/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from 'y/kafka';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceService implements OnModuleInit{
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService
  ){}

  async onModuleInit() {
      await this.kafkaClient.connect();
  }

  async register(dto: RegisterDto){
    const userExists = await this.dbService.user.findUnique({
      where: { email: dto.email },
    });

    if(userExists){
      throw new ConflictException('Este e-mail já está cadastrado.')
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.dbService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const {password, ...result } = newUser;
    return result; 
  }

  async login(dto: LoginDto){
    const userExists = await this.dbService.user.findUnique({
      where: { email: dto.email }
      
    })
    if(!userExists || !(await bcrypt.compare(dto.password, userExists.password))){
      throw new UnauthorizedException('Ivalid credentials')
    }
    const token  = this.jwtService.sign({ sub: userExists.id, email: userExists.email });

    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, {
      userId: userExists.id,
      timeStamp: new  Date().toISOString,
    });

    return {
      access_token: token,
      user: {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
        role: userExists.role
      },
    };
  }
  async getProfile(userId: string){
    const userExists = await this.dbService.user.findUnique({
      where: {id: userId},
    });
if (!userExists) {
    throw new UnauthorizedException('Usuário não encontrado');
  }

  // Removemos a senha antes de retornar
  const { password, ...result } = userExists;
  return result;  }
}
