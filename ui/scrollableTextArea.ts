import { CliRenderer, ScrollBoxRenderable, TextareaRenderable, type ScrollBoxOptions } from "@opentui/core";

export type ScrollableTextareaOptions = {
  placeholder: string;
} & Omit<ScrollBoxOptions, "scrollbarOptions" | "zIndex">;

export default class ScrollableTextarea extends ScrollBoxRenderable {
  _textarea: TextareaRenderable;
  constructor(ctx: CliRenderer, options?: ScrollableTextareaOptions) {
    super(ctx, {
      scrollbarOptions: {
        trackOptions: {
          backgroundColor: "transparent",
          foregroundColor: "#AC5401"
        }
      },
      zIndex: -1,
      ...options
    });
    this._textarea = new TextareaRenderable(ctx, {
      textColor: "#000000",
      cursorColor: "#000000",
      selectable: true,
      selectionBg: "#AC5401",
      selectionFg: "#ffffff",
      placeholder: options?.placeholder
    });
    this.add(this.textarea);
  }
  get textarea() {
    return this._textarea;
  }
}
