import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { AppDataSource } from '../connection/datasource.js';
import { Venue, VenueInput, Weather } from '../types/types.js';

@Resolver(() => Venue)
export class VenueResolver {
  private venueRepository: Repository<Venue> =
    AppDataSource.getRepository(Venue);
  private weatherCache = new Map<string, Weather>();

  @Query(() => [Venue])
  venues(): Promise<Venue[]> {
    return this.venueRepository.find();
  }

  @Query(() => Venue)
  venue(@Arg('id', () => ID) id: number): Promise<Venue> {
    return this.venueRepository.findOneBy({ id });
  }

  @Mutation(() => Venue)
  createVenue(@Arg('venueInput') venueInput: VenueInput): Promise<Venue> {
    const venue = new Venue();
    venue.address = venueInput.address;
    venue.name = venueInput.name;
    venue.capacity = venueInput.capacity;
    venue.location = venueInput.location;
    return this.venueRepository.save(venue);
  }

  @FieldResolver(() => Weather)
  async weather(@Root() venue: Venue): Promise<Weather> {
    const apiKey = process.env.WEATHER_API_KEY;
    const { location } = venue;
    if (this.weatherCache.has(location)) {
      return this.weatherCache.get(location);
    }
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();
    const { lat, lon } = geoData[0];
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weatherData: any = await weatherResponse.json();
    console.log(JSON.stringify(weatherData));
    const { temp, feels_like, temp_min, temp_max, humidity } = weatherData.main;
    const windSpeed = weatherData.wind.speed;
    const { description, main, icon } = weatherData.weather[0];
    const weather: Weather = {
      temp,
      feels_like,
      temp_min,
      temp_max,
      humidity,
      description,
      main,
      icon,
      windSpeed,
    };
    this.weatherCache.set(location, weather);
    return weather;
  }
}