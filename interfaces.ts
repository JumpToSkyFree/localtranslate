export interface ITranslator<TOther = undefined> {
  apiKey?: string;
  secretKey?: string;
  other?: TOther;

  initApi?(): void;
  translate: (data: string) => string | Promise<string>;
  get fromLanguage(): string;
  set fromLanguage(language: string);
  get toLanguage(): string;
  set toLanguage(language: string);

  get fromLanguageCode(): string;
  set fromLanguageCode(code);
  get toLanguageCode(): string;
  set toLanguageCode(code);
}

export interface ILanguageDetector<TOther = undefined> {
  apiKey?: string;
  secretKey?: string;
  other?: TOther;

  detectLanguage?(text: string): Promise<string>;
}
