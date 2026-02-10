import { BoxRenderable, RGBA, TextareaRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { type ILanguageDetector, type ITranslator } from "../interfaces";
import { ALL_LANGUAGES } from "../constants";
import LanguageDetector from "./languageDetector";
import DropDownSelect from "./dropDownSelect";
import Locker from "../locker";

export class LanguageSwithcer<TTranslatorOther, TLanguageDetectorOther> extends BoxRenderable {
  translationLanguagePicker: DropDownSelect<string>;
  locker: Locker;
  constructor(ctx: CliRenderer,
    translator: ITranslator<TTranslatorOther>,
    textarea: TextareaRenderable,
    languageDetector: ILanguageDetector<TLanguageDetectorOther>,
  ) {
    super(ctx, {
      flexDirection: "row",
      gap: 1
    });
    this.locker = new Locker(false);
    const languageDetectorElement = new LanguageDetector(ctx, translator, textarea, languageDetector);
    const arrow = new TextRenderable(ctx, {
      content: "->",
      fg: "#AC5401"
    });
    this.translationLanguagePicker = new DropDownSelect<string>(ctx, {
      defaultValue: ALL_LANGUAGES[translator.toLanguage as string] as string,
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
        if (!this.locker.locked) {
          this.locker.lock();
          translator.toLanguage = language.name;
          translator.toLanguageCode = language.value;
          this.locker.unlock();
        }
      }
    });
    this.add(languageDetectorElement);
    this.add(arrow);
    this.add(this.translationLanguagePicker);
  }
}
