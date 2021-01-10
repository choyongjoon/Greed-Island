import { Card, SpellCard } from "./Card";

export interface Book {
  fixedSlots: Array<Card>;
  freeSlots: Array<Card | SpellCard>;
}

export function createBook(): Book {
  return {
    fixedSlots: new Array(100),
    freeSlots: new Array(45),
  };
}
