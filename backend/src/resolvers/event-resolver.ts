import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { In, Repository } from 'typeorm';
import { AppDataSource } from '../connection/datasource.js';
import { Artist, Event, EventInput, Venue } from '../types/types.js';

@Resolver(() => Event)
export class EventResolver {
  private eventRepository: Repository<Event> =
    AppDataSource.getRepository(Event);
  private venueRepository: Repository<Venue> =
    AppDataSource.getRepository(Venue);
  private artistRepository: Repository<Artist> =
    AppDataSource.getRepository(Artist);

  //@Authorized()
  @Query(() => [Event])
  async events() {
    return await this.eventRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  @FieldResolver(() => Venue)
  async venue(@Root() event: Event): Promise<Venue> {
    return this.venueRepository.findOneBy({ id: event.venueId });
  }

  @FieldResolver(() => [Artist])
  artists(@Root() event: Event): Promise<Artist[]> {
    return this.artistRepository.find({
      relations: ['events'],
      where: { events: { id: event.id } },
    });
  }

  @Query(() => Event)
  event(@Arg('id', () => ID) id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id });
  }

  @Authorized('ROLE_ADMIN')
  @Mutation(() => Event)
  async createEvent(@Arg('eventInput') eventInput: EventInput): Promise<Event> {
    const event = new Event();
    event.name = eventInput.name;
    event.description = eventInput.description;
    event.eventDate = new Date(eventInput.eventDate);
    event.category = eventInput.category;
    event.imageUrl = eventInput.imageUrl;
    event.venueId = eventInput.venueId;
    const artists: Artist[] = await this.artistRepository.find({
      where: { id: In(eventInput.artistIds) },
    });
    event.artists = artists;
    return this.eventRepository.save(event);
  }
}