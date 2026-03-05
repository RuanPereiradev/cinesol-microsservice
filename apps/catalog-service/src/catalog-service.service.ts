import { ConflictException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MovieStatus, SeatType } from '@prisma/client';
import { RegisterDto } from 'y/common/dto/auth';
import { CreateMovieDto } from 'y/common/dto/catalog';
import { CreateAditoriumDto } from 'y/common/dto/catalog/createAuditorium.dto';
import { Movie } from 'y/common/entities/movie.entity';
import { DatabaseService } from 'y/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from 'y/kafka';
import { Prisma } from '@prisma/client';
import { CreateSessionDto } from 'y/common/dto/catalog/createSession.dto';
@Injectable()
export class CatalogServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService
  ){}

  async onModuleInit() {
      await this.kafkaClient.connect();
  }

  async findAll(status?: MovieStatus) {
    return this.dbService.movie.findMany({
      where: {
        status: status,
      },
      include: {
        _count:{
          select: { sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string){
    const movie = await this.dbService.movie.findUnique({
      where: { id },
      include: {
        sessions: {
          include: {
            auditorium: true
          }
        }
      }
    });
    
    if(!movie) throw new NotFoundException('Filme não encontrado');
    return movie;
  }
  
  async register(dto: CreateMovieDto){
    const titleExists = await this.dbService.movie.findFirst({
      where: { title: dto.title },
    });

    if(titleExists) throw new ConflictException('Este titulo já existe');

    const movieEntity = new Movie({
      title: dto.title,
      synopsis: dto.synopsis,
      durationMinutes: dto.durationMinutes,
      posterUrl: dto.posterUrl,
      genres: dto.genres,
    })

    const newMovie = await this.dbService.movie.create({
      data: {
        id: movieEntity.id,
        title: movieEntity.title,
        synopsis: movieEntity.synopsis,
        durationMinutes: movieEntity.durationMinutes,
        posterUrl: movieEntity.posterUrl,
        genres: movieEntity.genres,
        status: MovieStatus.COMING_SOON
      }
    });

    this.kafkaClient.emit(KAFKA_TOPICS.CATALOG_MOVIE_ADD, {
      movieId: newMovie.id,
      title: newMovie.title,
      synopsis: newMovie.synopsis
    });

    return newMovie;
  }

  async createAuditorium(dto: CreateAditoriumDto){
    return await this.dbService.$transaction(async (tx) => {
      const auditorium = await tx.auditorium.create({
        data: { name: dto.name },
      });

      const seatsData: Prisma.SeatCreateManyInput[] = [];

      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for(let r = 0; r < dto.rowsCount; r++){
        for (let s = 1; s <= dto.seatsPerRow; s++) { 
          seatsData.push({
            row: alphabet[r],
            number: s,
            auditoriumId: auditorium.id,
            type: SeatType.REGULAR,
          });
       }
    }

    await tx.seat.createMany({data: seatsData});

    return auditorium;
    });
  }

  
  async createSession(dto: CreateSessionDto){
    const filmExist = await this.dbService.movie.findUnique({
      where: {id: dto.movieId}
    });
    if(!filmExist) throw new NotFoundException('Filme não encontrado')
      
    const auditorium = await this.dbService.auditorium.findUnique({
      where: { id: dto.auditoriumId }
    });
    if(!auditorium) throw new NotFoundException('Sala não encontrada');

    const session =  await this.dbService.session.create({
      data: {
        startTime: new Date(dto.startTime),
        audio: dto.audio,
        format: dto.format,
        price: dto.price,
        movieId: dto.movieId,
        auditoriumId: dto.auditoriumId
      },
      include: {
        movie: { select: { title: true } },
        auditorium: { select: { name: true } }
      }
    });
    this.kafkaClient.emit('catalog.session.created', {
    sessionId: session.id,
    startTime: session.startTime,
    movieTitle: session.movie.title
  });

  return session

  }

  async getSessionSeats(sessionId: string){
    const session = await this.dbService.session.findUnique({
      where: { id: sessionId },
      include: {
        auditorium: {
          include: {
            seats: true
          }
        },
        tickets: {
          select: { seatId: true }
        },
        seatLocks: {
          where: { expiresAt: { gt: new Date() }},
          select: { seatId: true }
        }
      }
    });
    if(!session) throw new NotFoundException('Sessão não encontrada');

    const occupiedSeats = new Set([
      ...session.tickets.map(t => t.seatId),
      ...session.seatLocks.map(l => l.seatId)
    ]);

    return session.auditorium.seats.map(seat => ({
      ...seat,
    isAvailable: !occupiedSeats.has(seat.id)
    }));
  }
  getHello(): string {
    return 'Hello World!';
  }

}
