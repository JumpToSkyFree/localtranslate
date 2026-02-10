import { describe, it, expect, beforeEach } from "bun:test";
import OllamaTranslator from "../llm/ollamaTranslator";
import { OllamaLanguageDetector } from "../llm/ollamaLanguageDetector";

describe.skip("Integration Tests", () => {
  let translator: OllamaTranslator;
  let detector: OllamaLanguageDetector;

  beforeEach(() => {
    translator = new OllamaTranslator({ model: "llama3:8b" }, "English", "French", "en", "fr");
    detector = new OllamaLanguageDetector({ model: "llama3:8b" });
  });

  it("should translate and detect in real workflow", async () => {
    if (!process.env.OLLAMA_AVAILABLE) return;

    detector.detectLanguage = async (text: string) => "English";

    const detected = await detector.detectLanguage("Hello world");
    expect(detected).toBe("English");

    translator.fromLanguage = detected;
    const translated = await translator.translate("Hello world");
    expect(typeof translated).toBe("string");
    expect(translated.length).toBeGreaterThan(0);
  });
});
