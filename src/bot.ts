import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { chunk } from "lodash";
import express from "express";
import { applyTextEffect, Variant } from "./textEffects";

import type { Variant as TextEffectVariant } from "./textEffects";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

import random from "random";

// Handle the /yo command to greet the user
bot.command("yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));

// Handle the /effect command to apply text effects using an inline keyboard
type Effect = { code: TextEffectVariant; label: string };
const allEffects: Effect[] = [
  {
    code: "w",
    label: "Monospace",
  },
  {
    code: "b",
    label: "Bold",
  },
  {
    code: "i",
    label: "Italic",
  },
  {
    code: "d",
    label: "Doublestruck",
  },
  {
    code: "o",
    label: "Circled",
  },
  {
    code: "q",
    label: "Squared",
  },
];

const effectCallbackCodeAccessor = (effectCode: TextEffectVariant) =>
  `effect-${effectCode}`;

const effectsKeyboardAccessor = (effectCodes: string[]) => {
  const effectsAccessor = (effectCodes: string[]) =>
    effectCodes.map((code) =>
      allEffects.find((effect) => effect.code === code)
    );
  const effects = effectsAccessor(effectCodes);

  const keyboard = new InlineKeyboard();
  const chunkedEffects = chunk(effects, 3);
  for (const effectsChunk of chunkedEffects) {
    for (const effect of effectsChunk) {
      effect &&
        keyboard.text(effect.label, effectCallbackCodeAccessor(effect.code));
    }
    keyboard.row();
  }

  return keyboard;
};

const textEffectResponseAccessor = (
  originalText: string,
  modifiedText?: string
) =>
  `Original: ${originalText}` +
  (modifiedText ? `\nModified: ${modifiedText}` : "");

const parseTextEffectResponse = (
  response: string
): {
  originalText: string;
  modifiedText?: string;
} => {
  const originalText = (response.match(/Original: (.*)/) as any)[1];
  const modifiedTextMatch = response.match(/Modified: (.*)/);

  let modifiedText;
  if (modifiedTextMatch) modifiedText = modifiedTextMatch[1];

  if (!modifiedTextMatch) return { originalText };
  else return { originalText, modifiedText };
};

bot.command("effect", (ctx) =>
  ctx.reply(textEffectResponseAccessor(ctx.match), {
    reply_markup: effectsKeyboardAccessor(
      allEffects.map((effect) => effect.code)
    ),
  })
);

const roll_phrases = [
  "(1) Saída de Carrara: Parece que hoje você acordou com o pé esquerdo, como quando o Agostinho esquece de abastecer o táxi. O dia promete desafios!",
"(2) Azar de Carrara: Hoje você está com o azar do Agostinho, parece que a Florida Táxi está fora de serviço.",
"(3) Cilada de Carrara: Hoje está mais complicado que o Agostinho tentando convencer a Dona Flor a investir em uma de suas ideias malucas.",
"(4) Confusão do Carrara: Hoje você está tão confuso quanto o Agostinho quando tem que escolher entre o Sinuca e o Táxi.",
"(5) Volta de Carrara: Tá mais enrolado que o Agostinho nas dívidas com o Beiçola, o dia hoje vai ser de desafios.",
"(6) Cobrança do Beiçola: Hoje você vai se sentir como o Agostinho quando o Beiçola vem cobrar a conta do pastel. Encare seus medos.",
"(7) Esquema de Carrara: O dia está pedindo um momento de reflexão. E uma cerveja no bar do Beiçola, para acalmar os ânimos.",
"(8) Negócio de Carrara: É um dia de fazer acordos, mas cuidado para não fazer uma parceria ruim como a de Agostinho e Beiçola.",
"(9) Surpresa de Carrara: O dia está neutro, com algumas surpresas, igual as ideias mirabolantes do Agostinho.",
"(10) Jeitinho de Carrara: O dia está neutro, mas com uma pitada de diversão. Que tal tentar um novo esquema como o Agostinho?",
"(11) Malandragem de Carrara: Hoje é um bom dia para manter as relações neutras e curtir o dia como o Agostinho curtiria.",
"(12) Paz de Carrara: Hoje você pode encontrar a tão sonhada paz que o Agostinho busca quando esquema dá certo.",
"(13) Benção de Carrara: Hoje você está na sorte do Agostinho quando acerta no jogo do bicho. Aproveite e compartilhe suas alegrias.",
"(14) Sorte de Carrara: Espere algumas mudanças positivas ou surpresas repentinas hoje, como quando o Agostinho ganha na corrida de cachorro.",
"(15) Dia do Carrara: Hoje é um dia de inspiração e malandragem, como quando o Agostinho encontra uma brecha nas regras.",
"(16) Aventura de Carrara: Uma aventura positiva como a de Agostinho no mundo das apostas pode estar esperando por você hoje.",
"(17) Fiasco de Carrara: Esteja preparado para qualquer coisa e não deixe que o dia te pegue de surpresa, como quando os esquemas do Agostinho dão errado!",
"(18) Dia de Sorte: Como quando o Agostinho ganha no jogo do bicho, espere um dia cheio de surpresas agradáveis e experiências positivas.",
"(19) Farra do Carrara: Hoje é um dia de vitória, como quando o Agostinho finalmente consegue comprar aquele carro antigo que tanto queria.",
"(20) Benção do Carrara: Hoje é um dia abençoado! Aproveite o equilíbrio, a paz e a harmonia que este dia lhe traz, como quando o Agostinho passa um dia sem se meter em ciladas."
];

bot.command("roll", (ctx) => {
  const chatId = ctx.chat.id;
  const roll = random.int(1, 20);
  ctx.reply(`🚕 ${roll_phrases[roll - 1]}`)
});


// Handle inline queries
const queryRegEx = /effect (monospace|bold|italic) (.*)/;
bot.inlineQuery(queryRegEx, async (ctx) => {
  const fullQuery = ctx.inlineQuery.query;
  const fullQueryMatch = fullQuery.match(queryRegEx);
  if (!fullQueryMatch) return;

  const effectLabel = fullQueryMatch[1];
  const originalText = fullQueryMatch[2];

  const effectCode = allEffects.find(
    (effect) => effect.label.toLowerCase() === effectLabel.toLowerCase()
  )?.code;
  const modifiedText = applyTextEffect(originalText, effectCode as Variant);

  await ctx.answerInlineQuery(
    [
      {
        type: "article",
        id: "text-effect",
        title: "Text Effects",
        input_message_content: {
          message_text: `Original: ${originalText}
Modified: ${modifiedText}`,
          parse_mode: "HTML",
        },
        reply_markup: new InlineKeyboard().switchInline("Share", fullQuery),
        url: "http://t.me/EludaDevSmarterBot",
        description: "Create stylish Unicode text, all within Telegram.",
      },
    ],
    { cache_time: 30 * 24 * 3600 } // one month in seconds
  );
});

// Return empty result list for other queries.
bot.on("inline_query", (ctx) => ctx.answerInlineQuery([]));

// Handle text effects from the effect keyboard
for (const effect of allEffects) {
  const allEffectCodes = allEffects.map((effect) => effect.code);

  bot.callbackQuery(effectCallbackCodeAccessor(effect.code), async (ctx) => {
    const { originalText } = parseTextEffectResponse(ctx.msg?.text || "");
    const modifiedText = applyTextEffect(originalText, effect.code);

    await ctx.editMessageText(
      textEffectResponseAccessor(originalText, modifiedText),
      {
        reply_markup: effectsKeyboardAccessor(
          allEffectCodes.filter((code) => code !== effect.code)
        ),
      }
    );
  });
}

// Handle the /about command
const aboutUrlKeyboard = new InlineKeyboard().url(
  "Host your own bot for free.",
  "https://cyclic.sh/"
);

// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "yo", description: "Be greeted by the bot" },
  {
    command: "effect",
    description: "Apply text effects on the text. (usage: /effect [text])",
  },
  {command: "roll", description: "rola"},
]);

// Handle all other messages and the /start command
const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by Cyclic, the next-generation serverless computing platform.

<b>Commands</b>
/yo - Be greeted by me
/effect [text] - Show a keyboard to apply text effects to [text]`;

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    reply_markup: aboutUrlKeyboard,
    parse_mode: "HTML",
  });

bot.command("start", replyWithIntro);
bot.on("message", replyWithIntro);

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
