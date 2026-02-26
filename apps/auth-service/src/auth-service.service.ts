import { BadRequestException, ConflictException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from 'y/common/dto/auth';
import { DatabaseService } from 'y/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from 'y/kafka';
import * as bcrypt from 'bcrypt';
import { Email } from 'y/common/value-objects/email';
import { Password } from 'y/common/value-objects/password';
import { User, UserRole } from 'y/common/entities/user.entity';

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

    const emailRes = Email.create(dto.email)
    const passwordRes = Password.create(dto.password) 

    if(emailRes.isFailure) throw new BadRequestException(emailRes.getError())
    if(passwordRes.isFailure) throw new BadRequestException(passwordRes.getError())

    const emailVO = emailRes.getValue();
    const passwordVO = passwordRes.getValue();

    const userExists = await this.dbService.user.findUnique({
      where: { email: emailVO.value },
    });

    if(userExists){
      throw new ConflictException('Este e-mail já está cadastrado.')
    }

    const hashedPassword = await passwordVO.toHash();

    const userEntity = new User({
      name: dto.name,
      email: emailVO,
      role: UserRole.USER
    })

    const newUser = await this.dbService.user.create({
      data: {
        id: userEntity.id,
        name: userEntity.name,
        email: emailVO.value,
        password: hashedPassword,
        role: userEntity.role
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
      timeStamp: new  Date().toISOString(),
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

  const { password, ...result } = userExists;
  return result;  
  }
}
