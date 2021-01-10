import { createPlayer } from "../src/Player";

test("Gon enters G.I.", () => {
  const gon = createPlayer({ name: "Gon" });

  expect(gon.book).toBeTruthy();
});
