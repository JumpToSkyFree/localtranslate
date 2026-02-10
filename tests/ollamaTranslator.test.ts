import { describe, it, expect, mock, beforeEach } from "bun:test";
import OllamaTranslator from "../llm/ollamaTranslator";

// Mock the ollama module
const mockChat = mock(() => Promise.resolve({
  message: { content: "Hello world" }
}));

mock.module("ollama", () => ({
  default: {
    chat: mockChat
  }
}));

describe("OllamaTranslator", () => {
  let translator: OllamaTranslator;

  beforeEach(() => {
    translator = new OllamaTranslator({ model: "llama3:8b" }, "English", "French", "en", "fr");
  });

  it("should initialize with correct parameters", () => {
    expect(translator.fromLanguage).toBe("English");
    expect(translator.toLanguage).toBe("French");
    expect(translator.fromLanguageCode).toBe("en");
    expect(translator.toLanguageCode).toBe("fr");
    expect(translator.other?.model).toBe("llama3:8b");
  });

  it("should translate text successfully", async () => {
    const result = await translator.translate("Hello world");
    expect(result).toBe("Hello world");
    expect(mockChat).toHaveBeenCalledWith({
      model: "llama3:8b",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "user" }),
        expect.objectContaining({ role: "user" })
      ])
    });
  });

  it("should handle empty model gracefully", async () => {
    const brokenTranslator = new OllamaTranslator({ model: "" }, "English", "French", "en", "fr");
    const result = await brokenTranslator.translate("test");
    expect(result).toBe("");
  });

  it("should update language properties", () => {
    translator.fromLanguage = "French";
    translator.toLanguage = "German";
    translator.fromLanguageCode = "fr";
    translator.toLanguageCode = "de";

    expect(translator.fromLanguage).toBe("French");
    expect(translator.toLanguage).toBe("German");
  });
});
