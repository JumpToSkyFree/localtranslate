import { BoxRenderable, RGBA, TextRenderable, type BoxOptions, type CliRenderer } from "@opentui/core";
import { SpinnerRenderable } from "opentui-spinner";

export type ButtonBoxOmitOptions = "paddingRight" | "paddingLeft" | "flexDirection";
// type TextOmitOptions = "content";
export type ButtonOptions = {
  content: string;
  textColor: string | RGBA;
} & Omit<BoxOptions, ButtonBoxOmitOptions>;

export default class Button extends BoxRenderable {
  _text: TextRenderable;
  _spinner: SpinnerRenderable;
  constructor(ctx: CliRenderer, options: ButtonOptions) {
    super(ctx, {
      paddingLeft: 1,
      paddingRight: 1,
      flexDirection: "row",
      gap: 1,
      ...options
    });
    this.onMouseOut = (event) => {
      if (options.onMouseOut)
        options.onMouseOut.bind(this)(event);
    }
    this.onMouseOver = (event) => {
      if (options.onMouseOver)
        options.onMouseOver.bind(this)(event);
    }
    this._spinner = new SpinnerRenderable(ctx, {
      visible: false,
    });
    this._text = new TextRenderable(ctx, {
      content: options.content,
      fg: options.textColor
    });
    this.add(this._spinner);
    this.add(this._text);
  }
  get text() {
    return this._text;
  }
  set text(text) {
    this._text = text;
  }
  get spinner() {
    return this._spinner;
  }
}
