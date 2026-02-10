import { CliRenderer, TextareaRenderable } from "@opentui/core";
import type { ITranslator } from "../interfaces";
import type { ButtonOptions } from "./button";
import Button from "./button";
import Locker from "../locker";

export class TranslateButton<IOther = undefined> extends Button {
  lock: Locker;
  constructor(ctx: CliRenderer, from: TextareaRenderable, to: TextareaRenderable, translator: ITranslator<IOther>, options?: Omit<ButtonOptions, "textColor" | "content">) {
    super(ctx, {
      textColor: "#fff",
      content: "TRANSLATE",
      backgroundColor: "#2748A9",
      ...options,
    });
    this.lock = new Locker(false);
    this.onMouseDown = async () => {
      if (from.plainText.length > 0 && !this.lock.locked) {
        this.lock.lock();
        this._spinner.visible = true;
        this._spinner.start();
        const translatedText = await translator.translate(from.plainText);
        this._spinner.stop();
        this._spinner.visible = false;
        to.clear();
        to.insertText(translatedText);
        this.lock.unlock();
      }
    }
  }
}
