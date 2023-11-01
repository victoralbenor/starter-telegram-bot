import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { chunk } from "lodash";
import express from "express";
import { applyTextEffect, Variant } from "./textEffects";

import type { Variant as TextEffectVariant } from "./textEffects";

const crypto = require('crypto');

function randomInt(min: number, max: number) {
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  return min + (randomNumber % (max - min + 1));
}

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

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
  const roll = randomInt(1, 20);
  ctx.reply(`🚕 ${roll_phrases[roll - 1]}`)
});


bot.command("rollberto", (ctx) => {
  const roll = randomInt(1, 20);
  ctx.reply(`🚕 ${roll_phrases[roll - 1]}`)
});

// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "roll", description: "rola" },
  { command: "rollberto", description: "rola e comemora" }
]);

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
