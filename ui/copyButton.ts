import { CliRenderer, TextareaRenderable } from "@opentui/core";
import Button, { type ButtonOptions } from "./button";

class CopyButton extends Button {
  constructor(ctx: CliRenderer, to: TextareaRenderable, options?: Omit<ButtonOptions, "textColor" | "content">) {
    super(ctx, {
      textColor: "#fff",
      content: "COPY",
      backgroundColor: "#AC5401",
      async onMouseDown() {
        ctx.copyToClipboardOSC52(to.plainText);
      },
      ...options,
    });
  }
}

export default CopyButton;
