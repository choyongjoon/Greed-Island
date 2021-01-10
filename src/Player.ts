import { Book, createBook } from "./Book";
import { City } from "./City";

export interface Effect {
  cardNumber: string;
}

export interface Player {
  name: string;
  book: Book;
  city?: City;
  effects: Array<Effect>;
}

export function createPlayer({ name }: { name: string }): Player {
  return {
    name,
    book: createBook(),
    effects: [],
  };
}
