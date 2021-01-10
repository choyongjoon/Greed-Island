import produce from "immer";
import { Book } from "./Book";

import { City } from "./City";
import { Player } from "./Player";

export interface Card {
  number: string;
  name: string;
  // 입수 난이도, acquisition difficulty
  rank: "SS" | "S" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  // 카드화 한도 제한 매수, card transformation limit
  limit: number;
  description: string;
}

type SpellType =
  | "regular"
  | "attack"
  | "defensive"
  | "anti-attack"
  | "continuous"
  | "versus"
  | "special";

type SpellTarget = Player | City;

interface PlayOptions<T extends SpellTarget = SpellTarget> {
  from: Player;
  to: T;
}

export interface SpellCard<T extends SpellTarget = SpellTarget> extends Card {
  range: "short" | "long";
  spellTypes: Array<SpellType>;
  onPlay: (playOptions: PlayOptions<T>) => PlayOptions<T>;
}

const cards: Array<Card | SpellCard> = [
  {
    number: "1001", // 훔쳐보기
    name: "Peek",
    rank: "G",
    limit: 200,
    description:
      "View contents of target player's (previously met) free slots.",
    range: "long",
    spellTypes: ["regular"],
    onPlay: (playOptions) => playOptions,
  } as SpellCard<Player>,
  {
    number: "1009",
    name: "Return", // 재래
    rank: "G",
    limit: 380,
    description: "Allows caster to fly back to a previously visited location.",
    range: "long",
    spellTypes: ["regular"],
    onPlay: ({ from, to }) => ({
      from: produce(from, (base) => {
        base.city = to;
      }),
      to,
    }),
  } as SpellCard<City>,
  {
    number: "1027",
    name: "Trace", // 추적
    rank: "G",
    limit: 200,
    description:
      "Current location of one target player will be available at all times. (Effect lasts until player leaves the game.)",
    range: "short",
    spellTypes: ["attack"],
    onPlay: function ({ from, to }) {
      return {
        from,
        to: produce(to, (base) => {
          base.effects.push({ cardNumber: this.number });
        }),
      };
    },
  } as SpellCard<Player>,
  {
    number: "1033",
    name: "Cling", // 밀착
    rank: "C",
    limit: 50,
    description:
      "Complete data of one player's restricted slots will be available at all times. (Effect lasts until player leaves the game.) ",
    range: "long",
    spellTypes: ["attack"],
    onPlay: (playOptions) => playOptions,
  } as SpellCard<Player>,
];

const cardMap = new Map(cards.map((card) => [card.number, card]));

export function createCard(number: string): Card {
  return {
    ...cardMap.get(number),
  };
}

function getSpellCard<T extends SpellTarget>(book: Book, freeSlotId: number) {
  const spellCard = book.freeSlots[freeSlotId];
  if (!spellCard) {
    throw new Error(`no spell card at freeSlots[${freeSlotId}]`);
  }
  if (!(spellCard as SpellCard).spellTypes) {
    throw new Error(`the card at freeSlots[${freeSlotId}] is not a spell card`);
  }

  return spellCard as SpellCard<T>;
}

export function useSpellCard<T extends SpellTarget>({
  freeSlotId,
  from,
  to,
}: {
  freeSlotId: number;
  from: Player;
  to: T;
}) {
  const spellCard = getSpellCard<T>(from.book, freeSlotId);
  const { from: fromAfterPlay, to: toAfterPlay } = spellCard.onPlay({
    from,
    to,
  });
  return {
    from: produce(fromAfterPlay, (base) => {
      base.book.freeSlots[freeSlotId] = undefined;
    }),
    to: toAfterPlay,
  };
}
