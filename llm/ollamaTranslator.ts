import ollama from "ollama";
import type { ITranslator } from "../interfaces.ts";

export interface OllamaTranslatorParams {
  port?: number;
  model: string;
}

export default class OllamaTranslator implements ITranslator<OllamaTranslatorParams> {
  other?: OllamaTranslatorParams | undefined;
  protected initialPrompt?: string;
  protected translatingPrompt?: string;
  _fromLanguage: string;
  _toLanguage: string;
  _fromLanguageCode: string;
  _toLanguageCode: string;
  constructor(params: OllamaTranslatorParams,
    fromLanguage: string,
    toLanguage: string,
    fromLanguageCode: string,
    toLanguageCode: string,
  ) {
    this.other = {
      port: params.port,
      model: params.model,
    };
    this._fromLanguage = fromLanguage;
    this._toLanguage = toLanguage;
    this._fromLanguageCode = fromLanguageCode;
    this._toLanguageCode = toLanguageCode;
  }
  set fromLanguage(langauge: string) {
    this._fromLanguage = langauge;
  }

  get fromLanguage() {
    return this._fromLanguage;
  }

  set toLanguage(langauge: string) {
    this._toLanguage = langauge;
  }

  get toLanguage(): string {
    return this._toLanguage;
  }

  get fromLanguageCode() {
    return this._fromLanguageCode;
  }

  set fromLanguageCode(code) {
    this._fromLanguageCode = code;
  }

  get toLanguageCode(): string {
    return this._toLanguageCode;
  }

  set toLanguageCode(code) {
    this._toLanguageCode = code;
  }

  // TODO: Implement stream output architecture for a continuous translated text output.
  async translate(text: string): Promise<string> {
    if (this.other && "model" in this.other && this.other.model !== undefined && this.other.model.length > 0) {
      this.translatingPrompt = `
      # Task:

      You are a professional ${this.fromLanguage} (${this.fromLanguageCode}) to ${this.toLanguage} (${this.toLanguageCode}) polyglot translator. 
      Your goal is to accurately convey the meaning and nuances of the original ${this.fromLanguage} text while adhering to ${this.toLanguage} grammar, vocabulary, and cultural sensitivities.
      Produce only the ${this.toLanguage} translation, without any additional explanations or commentary. 
      Please translate the following ${this.fromLanguage} text into ${this.toLanguage}, also remember to the translation must be in the native characters of ${this.toLanguage}:


      # Output Requirements:

        1. Your asnwer must be only the translation of the given text without any further explanations.
        2. Your answer must be only the translation of the given text without quotes added by you, unless the given text contains other symbols like quotes,
          emojis or any symbols that are characters of any language.
        3. Maintain the existence of other symbols that are not characters when you translate the given text, symbols must remain as a part of the meaning.
        4. Do not provide explanations, preamble, or punctuation. Do not use Markdown, JSON, or numbering. Provide the selection as plain translation only.
        5. Your answer must be translation of the given text in the native symbols or characters of ${this.toLanguage} language.
        6. If the given text is not meaningful, translate the words as they are and maintain the order.
        7. If the given text is not meaningful and consists of characters, translate the characters to the characters or symbols of ${this.toLanguage} langauge and maintain order.

      # Text:

      ${text}
      `;
      const response = await ollama.chat({
        model: this.other?.model,
        messages: [
          {
            role: 'user',
            content: this.translatingPrompt
          }
        ]
      })
      return response.message.content;
    }
    return "";
  }
}
