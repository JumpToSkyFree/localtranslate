![LocalTranslate Logo](https://cdn.jsdelivr.net/gh/JumpToSkyFree/localtranslate@main/assets/Logo.png)

# LocalTranslate

> **But not like any other translator.** \
> [!WARNING] This application is still under development, you might experience failures and sudden exit of application.

## What is LocalTranslate?

A local terminal app text translator that uses LLMs to translate text of various languages. But not like any translator.

LocalTranslate is not only built for translating text to other languages, it is built for conversations where you can pick how you can be addressed and how you can address the person you are speaking with in the translation and you can change the personality of how your text is being translated.

![LocalTranslate Demo](https://cdn.jsdelivr.net/gh/JumpToSkyFree/localtranslate@main/assets/LocalTranslator.gif)

## Why i am making LocalTranslate

I use translators a lot everyday to speak with people that don't know English, the problem I faced with other translators like Google Translate or ChatGPT Translator is that these translators don't know who I am or with whom I am speaking to, sometimes I am being addressed as a female (I am a male) and sometimes whom I am talking to being addressed in opposite gender that makes the conversations odd and uncomfortable. Each time I translate a text, I have to do these repeated tasks:

1. I have to check if I am being addressed correctly.
2. I have to check if the person I am speaking to being addressed correctly.
3. I have to check if the translation is formal when I want it to be funny.

Which made the task of communicating with others **unnecessarily difficult**.

## How LocalTranslate works & the cost of using LLMs

LocaleTranslate relies primarily on LLMs for superior translation accuracy. While more effective than traditional algorithms, this approach requires significant CPU resources to run large language models for even simple communication.

Detecting languages is a feature of LocalTranslate app, it can use library like fasttext or detect language using Large Language Models which can be.

> Language detection using LLMs is just an option, text classification models will be integrated to the application for a much faster execution and less GPU load.

## Requirements

### Running LocalTranslate with Ollama:

To run **LocalTranslate** locally, you need to install [Ollama](https://www.ollama.com/) and install any model you prefer *__(Big models give better translation and language detection)__*.

Run the following command in terminal to install `qwen3:14b` model or choose models from [Ollama Models](https://ollama.com/search):

```bash
ollama run qwen3:4b
```

Edit the constants **DETECTION_MODEL** and **TRANSLATION_MODEL** in **index.ts** file and set the preferred models. **(qwen3:1.7b for language detection and qwen2.5:3b for translation work best without overheating your MacBook)**

```typescript
const DETECTION_MODEL = "qwen3:4b";
const TRANSLATION_MODEL = "qwen2.5:7b";
```


## Installation

Then run the following commands to run the application:

```bash
git clone https://www.github.com/jumptoskyfree/localtranslate localtranslate && cd localtranslate
bun install
bun run index.ts
```

To run tests:

```bash
bun tests
```

### Running LocalTranslate with other models:

Not supported yet, soon it will be available.


## Goals:

- [ ] Loading configuration from a file.
- [ ] Add the user personality informations to the prompts.
- [ ] Add a list of personalities with whom the user speaks much.
- [ ] Add conversation mode to the UI.
- [ ] Add fastText.js implementation for detecting languages.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


