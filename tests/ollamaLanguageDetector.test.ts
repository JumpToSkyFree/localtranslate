import { describe, it, expect, mock, beforeEach } from "bun:test";
import { OllamaLanguageDetector } from "../llm/ollamaLanguageDetector";
import { ALL_LANGUAGES } from "../constants.ts";

const mockChat = mock(() => Promise.resolve({
  message: { content: "English" }
}));

mock.module("ollama", () => ({
  default: {
    chat: mockChat
  }
}));

describe("OllamaLanguageDetector", () => {
  let detector: OllamaLanguageDetector;

  beforeEach(() => {
    detector = new OllamaLanguageDetector({ model: "llama3:8b" });
  });

  it("should detect language successfully", async () => {
    const result = await detector.detectLanguage("Hello world");
    expect(result).toBe("English");
    const languagesNames = Object.keys(ALL_LANGUAGES).map((language) => language) as unknown as string;
    expect(languagesNames).toContain(result);
  });

  it("should return default English on failure", async () => {
    const brokenDetector = new OllamaLanguageDetector({ model: "" });
    const result = await brokenDetector.detectLanguage("test");
    expect(result).toBe("English");
  });

  it("should call ollama chat with proper parameters", async () => {
    await detector.detectLanguage("Bonjour le monde");

    expect(mockChat).toHaveBeenCalledWith({
      model: "llama3:8b",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "user" }),
        expect.objectContaining({ role: "user" })
      ])
    });
  });
});
