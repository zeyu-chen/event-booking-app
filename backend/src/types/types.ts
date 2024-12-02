import { Field, Float, ID, InputType, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@ObjectType()
@Entity('Artist')
export class Artist {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  bio: string;

  @Field()
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => [Event])
  @ManyToMany(() => Event, (event) => event.artists)
  events: Event[];
}

@ObjectType()
@Entity('Booking')
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column()
  bookingDate: Date;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Int)
  @Column()
  eventId: number;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.id)
  @JoinColumn({ name: 'eventId' })
  event?: Relation<Event>;

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => [Ticket])
  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];
}

@InputType()
export class BookingInput {
  @Field(() => Int)
  eventId: number;
  @Field(() => [Int])
  seats: number[];
}

@ObjectType()
@Entity('Event')
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Date)
  @Column()
  eventDate: Date;

  @Field()
  @Column({ nullable: true })
  category: string;

  @Field()
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => Int)
  @Column()
  venueId: number;

  @Field(() => Venue)
  @ManyToOne(() => Venue, (venue) => venue.id)
  @JoinColumn({ name: 'venueId' })
  venue?: Relation<Venue>;

  @Field(() => [Artist])
  @ManyToMany(() => Artist, (artist) => artist.events)
  @JoinTable({ name: 'Event_Artist' })
  artists: Artist[];
}

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment?: string;

  @Column()
  userId: number;

  @Column()
  eventId: number;
}

@ObjectType()
@Entity('Ticket')
export class Ticket {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  seatNo: number;

  @Field(() => Int)
  @Column()
  bookingId: number;

  @Field(() => Booking)
  @ManyToOne(() => Booking, (booking) => booking.tickets)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}

@ObjectType()
@Entity('User')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  role: string;
}

@InputType()
export class UserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  role?: string;
}

@ObjectType()
@Entity('Venue')
export class Venue {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  location: string;

  @Field(() => Int)
  @Column()
  capacity: number;

  @Field(() => [Event])
  @OneToMany(() => Event, (event) => event.venueId)
  events: Event[];
}

@ObjectType()
export class Weather {
  @Field(() => Float)
  temp: number;
  @Field(() => Float)
  feels_like: number;
  @Field(() => Float)
  temp_min: number;
  @Field(() => Float)
  temp_max: number;
  @Field(() => Float)
  humidity: number;
  @Field()
  description: string;
  @Field()
  main: string;
  @Field()
  icon: string;
  @Field()
  windSpeed: string;
}

@InputType()
export class EventInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  eventDate: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Int)
  venueId: number;

  @Field(() => [Int])
  artistIds: number[];
}

@InputType()
export class VenueInput {
  @Field()
  name: string;
  @Field()
  address: string;
  @Field()
  location: string;
  @Field()
  capacity: number;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
export class LoginToken {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}

export class UserContext {
  name: string;
  id: number;
  role: string;
}

export class AppContext {
  userContext?: UserContext;
}

@ObjectType()
export class EventSeatAvailability {
  @Field(() => Int)
  eventId: number;
  @Field(() => Int)
  seatsAvailable: number;
  @Field(() => [Int])
  seatNos: number[];
}
