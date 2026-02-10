import { BoxRenderable, CliRenderer, RGBA, ScrollBoxRenderable, TextRenderable, type BoxOptions, type ScrollBoxOptions } from "@opentui/core";
import Button from "./button";

export type DropDwonOption<T> = {
  name: string;
  value: T;
  backgroundColor?: string | RGBA;
  foregroundColor?: string | RGBA;
};

export type DropDownSelectOptions<T> = {
  dropDownOptions: DropDwonOption<T>[],
  defaultValue: T;
  buttonBackgroundColor?: string | RGBA;
  buttonForegroundColor?: string | RGBA;
  optionsForegroundColor?: string | RGBA;
  scrollBoxOptions?: ScrollBoxOptions;
  onChange?: (value: DropDwonOption<T>) => void;
} & BoxOptions;

export default class DropDownSelect<OptionsValue> extends BoxRenderable {
  _button: Button;
  _active: boolean = false;
  _optionsScrollBox: ScrollBoxRenderable;
  _value: OptionsValue;
  onChange?: (value: DropDwonOption<OptionsValue>) => void;
  constructor(ctx: CliRenderer, options: DropDownSelectOptions<OptionsValue>) {
    super(ctx, {
      flexDirection: "column",
      ...options
    });
    this.onChange = options.onChange;
    this._value = options.defaultValue;
    const labels = options.dropDownOptions.filter((option) => {
      if (option.value === options.defaultValue) {
        return option;
      }
    });
    console.log(options.defaultValue);
    if (labels.length === 0) throw `DropDownSelect failed because there are no matching options for option ${options.defaultValue}`;
    this._button = new Button(ctx, {
      backgroundColor: options.buttonBackgroundColor,
      content: labels.at(0)?.name ?? "",
      textColor: options?.buttonForegroundColor ?? ""
    });
    this._button.onMouseDown = () => {
      this._active = !this._active;
    }
    this._optionsScrollBox = new ScrollBoxRenderable(ctx, {
      visible: this._active,
      zIndex: 100,
      height: 10,
      width: 30,
      bottom: -10,
      position: "absolute",
      ...options.scrollBoxOptions
    });
    this._button.onMouseDown = (event) => {
      this._active = !this._active;
      this._optionsScrollBox.visible = this._active;
      if (this._button.onMouseDown && options.onMouseDown)
        this._button.onMouseDown.bind(options.onMouseDown)(event);
    }
    options.dropDownOptions.map((option) => {
      const optionLabel = new TextRenderable(ctx, {
        content: option.name,
        marginLeft: 1,
        bg: option?.backgroundColor,
        fg: option?.foregroundColor,
      });
      optionLabel.onMouseDown = () => {
        if (this.onChange) {
          this.onChange(option);
          this._button._text.content = option.name;
          this._optionsScrollBox.visible = false;
          this.active = !this.active;
        }
      }
      this._optionsScrollBox.add(optionLabel);
    });
    this.add(this._button);
    this.add(this._optionsScrollBox);
  }
  get button() {
    return this._button;
  }
  set button(button: Button) {
    this._button = button;
    this.add(this._button);
  }
  get active() {
    return this._active;
  }
  set active(isActive) {
    this._active = isActive;
  }
  get value() {
    return this._value;
  }
  set value(_value: OptionsValue) {
    this._value = _value;
  }
}
