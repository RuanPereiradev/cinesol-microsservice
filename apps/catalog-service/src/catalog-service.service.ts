import { ConflictException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MovieStatus } from '@prisma/client';
import { RegisterDto } from 'y/common/dto/auth';
import { CreateMovieDto } from 'y/common/dto/catalog';
import { Movie } from 'y/common/entities/movie.entity';
import { DatabaseService } from 'y/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from 'y/kafka';

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
    const titileExists = await this.dbService.movie.findFirst({
      where: { title: dto.title },
    });

    if(titileExists) throw new ConflictException('Este titulo já existe');

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

  getHello(): string {
    return 'Hello World!';
  }
}
