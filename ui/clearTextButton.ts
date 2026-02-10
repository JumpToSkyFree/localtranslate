import { CliRenderer, TextareaRenderable } from "@opentui/core";
import Button, { type ButtonOptions } from "./button";

export class ClearButton extends Button {
  constructor(ctx: CliRenderer, from: TextareaRenderable, to: TextareaRenderable, options?: Omit<ButtonOptions, "textColor" | "content">) {
    super(ctx, {
      textColor: "#fff",
      content: "CLEAR",
      backgroundColor: "#A5232F",
      async onMouseDown() {
        from.clear();
        to.clear();
      },
      ...options,
    });
  }
}
