import { Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { AppDataSource } from '../connection/datasource.js';
import { Artist } from '../types/types.js';

@Resolver(() => Artist)
export class ArtistResolver {
  private artistRepository: Repository<Artist> =
    AppDataSource.getRepository(Artist);

  @Query(() => [Artist])
  artists(): Promise<Artist[]> {
    return this.artistRepository.find();
  }
}
