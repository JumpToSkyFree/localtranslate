import { BoxRenderable, createCliRenderer } from "@opentui/core";
import OllamaTranslator from "./llm/ollamaTranslator";
import ScrollableTextarea from "./ui/scrollableTextArea";
import { TranslateButton } from "./ui/translateButton";
import { ClearButton } from "./ui/clearTextButton";
import { OllamaLanguageDetector } from "./llm/ollamaLanguageDetector";
import CopyButton from "./ui/copyButton";
import { LanguageSwithcer } from "./ui/languageSwitcher";

const DETECTION_MODEL = "qwen2.5:7b";
const TRANSLATION_MODEL = "mistral-nemo:latest";

// TODO: Implement editor configuration loader (theme, locale, llm provider).
const renderer = await createCliRenderer();

renderer.setTerminalTitle("LocalTranslator")

// TODO: Extend implementation to use different LLM providers.
const translator = new OllamaTranslator({
  model: TRANSLATION_MODEL,
},
  "French",
  "English",
  "fr",
  "en"
);

const languageDetector = new OllamaLanguageDetector({
  model: DETECTION_MODEL,
});

const scrollBox2 = new ScrollableTextarea(renderer, {
  placeholder: "The translation will appear here."
});
const textarea2 = scrollBox2.textarea;

const scrollBox1 = new ScrollableTextarea(renderer, {
  placeholder: "Paste the text you want to translate..."
});
const textarea1 = scrollBox1.textarea;

const languageSwitcher = new LanguageSwithcer(renderer, translator, textarea1, languageDetector)

const container = new BoxRenderable(renderer, {
  id: "container",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 2,
  paddingRight: 2,
});

const translatorOptionsStatusLineContainer = new BoxRenderable(renderer, {
  flexDirection: "row",
  height: 1,
  flexGrow: 0,
  backgroundColor: "#D3C7BB",
  justifyContent: "space-between",
  marginTop: 1,
  marginBottom: 1
});

const rightsideBox = new BoxRenderable(renderer, {
  flexDirection: "row",
});


const copy = new CopyButton(renderer, textarea2);

const translateButton = new TranslateButton(renderer, textarea1, textarea2, translator);
const clearButton = new ClearButton(renderer, textarea1, textarea2);


const leftsideBox = new BoxRenderable(renderer, {
  flexDirection: "row",
});


leftsideBox.add(languageSwitcher);
translatorOptionsStatusLineContainer.add(leftsideBox);
translatorOptionsStatusLineContainer.add(rightsideBox);
container.add(scrollBox1);
container.add(translatorOptionsStatusLineContainer);
container.add(scrollBox2);
rightsideBox.add(copy);
rightsideBox.add(translateButton);
rightsideBox.add(clearButton);

renderer.root.add(container);
