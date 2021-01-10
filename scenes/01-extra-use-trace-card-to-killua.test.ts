import { createCard, useSpellCard } from "../src/Card";
import { citiesByName } from "../src/City";
import { createPlayer } from "../src/Player";

test("Extra uses 'trace' to Killua and run away", () => {
  let extra = createPlayer({ name: "extra" });
  extra.book.freeSlots[0] = createCard("1001");
  extra.book.freeSlots[1] = createCard("1033");
  extra.book.freeSlots[2] = createCard("1027");
  extra.book.freeSlots[3] = createCard("1009");

  let killua = createPlayer({ name: "Killua" });

  // '추적' 온!! 키르아 공격!!
  ({ from: extra, to: killua } = useSpellCard({
    freeSlotId: 2,
    from: extra,
    to: killua,
  }));

  expect(extra.book.freeSlots[2]).toBeUndefined();
  expect(killua.effects[0].cardNumber).toBe("1027");

  // '재래' 온! 마사드라로!!
  ({ from: extra } = useSpellCard({
    freeSlotId: 3,
    from: extra,
    to: citiesByName.Masadora,
  }));

  expect(extra.city).toEqual(citiesByName.Masadora);
});
