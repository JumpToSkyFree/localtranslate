import ollama from "ollama";
import { type ILanguageDetector } from "../interfaces";
import { ALL_LANGUAGES } from "../constants";

export interface OllamaLanguageDetectorParams {
  port?: number;
  model: string;
}

export class OllamaLanguageDetector implements ILanguageDetector<OllamaLanguageDetectorParams> {
  other?: OllamaLanguageDetectorParams | undefined;
  protected initialPrompt?: string;
  protected translatingPrompt?: string;
  protected _fromLanguage?: string;
  protected _toLanguage?: string;
  constructor(params: OllamaLanguageDetectorParams) {
    this.other = {
      port: params.port,
      model: params.model
    }
  }

  async detectLanguage(text: string): Promise<string> {
    if (this.other && "model" in this.other && this.other.model !== undefined) {
      const allLanguages = Object.keys(ALL_LANGUAGES).map((language) => (
        `${language}`
      ));
      // this.translatingPrompt = `
      // You're a translator and your job is to detect a language based on a letters and NOT CONTEXT,
      // you're given a list of languages to pick from.
      // The languages that you should consider picking from:

      // ${allLanguages}

      // Text:

      // ${text}


      // # Output requirements:

      // - You must only provide answer as text, do not output markdown or json.
      // - Your answer must be the name of the language namges that are listed.
      // - Do not use the context of the text to detect the language, detect the language by letters.
      // - Your answer must be one of the provided languages that suits exactly the given text.`;
      //
      this.translatingPrompt = `
      ### SYSTEM INSTRUCTIONS
      You are a Language Detection Engine. You identify languages based on two factors:
      1. The Alphabet (Script)
      2. The Vocabulary (Words)
      
      ### STRICT DECISION HIERARCHY
      1. If the script is Latin (A-Z), you MUST pick a language that uses the Latin alphabet (e.g., English, Spanish, French).
      2. If the script is Cyrillic (А-Я), you MUST pick a language that uses Cyrillic (e.g., Russian, Bulgarian).
      3. If the script is Hanzi/Kanji, you MUST pick Chinese or Japanese.
      
      ### EXAMPLES
      - Text: "Russian video" -> Alphabet: Latin -> Result: English
      - Text: "English текст" -> Alphabet: Cyrillic -> Result: Russian
      - Text: "Hola amigo" -> Alphabet: Latin -> Result: Spanish
      
      ### AVAILABLE LANGUAGES (Select exactly one from this list):
      ${allLanguages}
      
      ### INPUT DATA
      Text: "${text}"
      
      ### OUTPUT REQUIREMENT
      - Provide ONLY the name of the language. 
      - No explanation. 
      - No markdown.
      
      FINAL ANSWER:`
      const response = await ollama.chat({
        model: this.other?.model,
        messages: [
          {
            role: 'user',
            content: this.translatingPrompt
          }
        ]
      });
      const languageName = response.message.content.trim();
      if (!(languageName in Object.keys(ALL_LANGUAGES))) {
        // TODO: This is an exception when an LLM not selecting
        // an explicitly defined language.
      }
      return languageName;
    }
    return "English";
  }
}
