import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "../session";

describe("createSessionToken / verifySessionToken", () => {
  it("genera un token che, verificato, restituisce lo stesso userId", async () => {
    const token = await createSessionToken("user-123");

    const userId = await verifySessionToken(token);

    expect(userId).toBe("user-123");
  });

  it("rifiuta un token manomesso", async () => {
    const token = await createSessionToken("user-123");
    const tamperedToken = `${token.slice(0, -2)}xx`;

    const userId = await verifySessionToken(tamperedToken);

    expect(userId).toBeNull();
  });

  it("rifiuta una stringa che non è un token valido", async () => {
    const userId = await verifySessionToken("non-e-un-token");

    expect(userId).toBeNull();
  });
});
