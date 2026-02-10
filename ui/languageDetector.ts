import { CliRenderer, RGBA, TextareaRenderable } from "@opentui/core";
import { type ILanguageDetector, type ITranslator } from "../interfaces";
import DropDownSelect from "./dropDownSelect";
import { ALL_LANGUAGES } from "../constants";
import Locker from "../locker";

export default class LanguageDetector<TTranslatorOther, TLanguageDetectorOther> extends DropDownSelect<string> {
  oldText: string = "";
  locker: Locker = new Locker(false);
  renderer: CliRenderer;
  translator: ITranslator<TTranslatorOther>;
  languageDetector: ILanguageDetector<TLanguageDetectorOther>;
  constructor(
    renderer: CliRenderer,
    translator: ITranslator<TTranslatorOther>,
    textarea: TextareaRenderable,
    languageDetector: ILanguageDetector<TLanguageDetectorOther>,
  ) {
    super(renderer, {
      defaultValue: ALL_LANGUAGES[translator.fromLanguage as string] as string,
      dropDownOptions: Object.keys(ALL_LANGUAGES).map((language) => ({
        name: language.toUpperCase(),
        value: ALL_LANGUAGES[language] as string,
        foregroundColor: RGBA.fromValues(1, 1, 1, 0.7)
      })),
      buttonBackgroundColor: "#AC5401",
      buttonForegroundColor: "white",
      scrollBoxOptions: {
        backgroundColor: "#6A645E",
        opacity: 1
      },
      onChange: (language) => {
        translator.fromLanguage = language.name;
      }
    });
    this.translator = translator;
    this.languageDetector = languageDetector;
    this.renderer = renderer;
    textarea.onMouseOut = async () => {
      this.detect(textarea.plainText);
    };
    renderer.keyInput.on("paste", async (event) => {
      this.detect(event.text);
    });
  }

  async detect(text: string) {
    if (this.languageDetector.detectLanguage && text.length > 0 && this.oldText != text && !this.locker.locked) {
      this.locker.lock();
      this.button.spinner.visible = true;
      this.button.spinner.start();
      const detectedLanguage = await this.languageDetector.detectLanguage(text);
      if (detectedLanguage in ALL_LANGUAGES && ALL_LANGUAGES[detectedLanguage] != undefined) {
        this.translator.fromLanguageCode = ALL_LANGUAGES[detectedLanguage];
        this.translator.fromLanguage = detectedLanguage;
      }
      else {
        // FIX: When detectedLanguage doesn't exist in ALL_LANGUAGES (The language is not identified),
        // an error must be shown to the user.
        process.exit(0);
      }
      this.button._text.content = detectedLanguage.toUpperCase();
      this.button.spinner.visible = false;
      this.button.spinner.stop();
      this.oldText = text;
      this.locker.unlock();
    }
  }
}
