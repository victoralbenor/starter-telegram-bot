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

/* August 2023
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
*/

/* November 2023
const roll_phrases = [
  "(1) Despertar Congelado: Hoje parece que você acordou com o pé esquerdo, como quando o Papai Noel se atrasa na véspera de Natal. Prepare-se para superar obstáculos!",
  "(2) Nevasca Imprevista: O azar bateu à sua porta, como uma tempestade de neve inesperada no Polo Norte, dificultando a saída do trenó do Papai Noel.",
  "(3) Lista de Pedidos Confusa: O dia será tão confuso quanto organizar a longa lista de pedidos de Natal, tentando agradar a todos.",
  "(4) Decoração Enrolada: Hoje você está tão perdido quanto alguém tentando desembaraçar as luzes de Natal.",
  "(5) Presentes Atrasados: O dia está tão corrido quanto a busca por presentes de última hora, tentando agradar todos sem esquecer ninguém.",
  "(6) Desafio na Ceia: Como um cozinheiro estressado preparando a ceia de Natal, hoje você terá que enfrentar desafios e manter a calma.",
  "(7) Momento de Reflexão Natalino: O dia pede uma pausa para refletir, talvez com um chocolate quente ao lado da lareira.",
  "(8) Troca de Presentes Arriscada: Um dia para fazer escolhas, mas cuidado para não acabar com uma troca de presentes desastrosa.",
  "(9) Surpresa de Natal: Um dia neutro com surpresas inesperadas, como encontrar um presente escondido sob a árvore.",
  "(10) Criatividade Natalina: Um dia comum, mas perfeito para inovar na decoração ou nos preparativos natalinos.",
  "(11) Espírito Natalino Astuto: Um bom dia para manter a calma e curtir o espírito de Natal com astúcia.",
  "(12) Paz Natalina: Hoje você pode encontrar a paz e a tranquilidade do Natal, como um jantar harmonioso em família.",
  "(13) Benção do Espírito Natalino: Um dia cheio de sorte e alegria, como acordar e encontrar exatamente o que desejava sob a árvore de Natal.",
  "(14) Sorte na Neve: Espere por mudanças positivas, como uma surpresa agradável no calendário do advento.",
  "(15) Inspiração Natalina: Um dia para ser criativo e alegre, como criar uma nova tradição de Natal em família.",
  "(16) Aventura no Inverno: Prepare-se para uma aventura positiva, talvez um passeio inesperado para ver luzes de Natal.",
  "(17) Fiasco no Polo Norte: Esteja pronto para qualquer eventualidade, como um apagão durante a ceia de Natal!",
  "(18) Dia de Neve Afortunado: Como acordar com a notícia de um feriado de neve, espere um dia cheio de surpresas e alegrias.",
  "(19) Festa de Natal Vitoriosa: Um dia de conquistas, como finalizar com sucesso todos os preparativos natalinos.",
  "(20) Harmonia Natalina Absoluta: Um dia abençoado, cheio de paz, harmonia e alegria, como um Natal perfeito em família."
];
*/

// January 2023
const roll_phrases = [
  "(1) Novo Começo: Hoje parece um novo começo, assim como o início de um novo ano. Prepare-se para superar obstáculos!",
  "(2) Fogos Inesperados: A sorte bateu à sua porta, como uma surpreendente queima de fogos na véspera de Ano Novo, tornando sua jornada emocionante.",
  "(3) Metas Confusas: O dia será tão confuso quanto fazer uma longa lista de resoluções de Ano Novo, tentando agradar a todos.",
  "(4) Decorações Desenroladas: Hoje, você está tão perdido quanto alguém tentando desenrolar as decorações de Ano Novo.",
  "(5) Contagem Regressiva para o Sucesso: O dia está tão agitado quanto as compras de presentes de última hora de Ano Novo, tentando agradar a todos sem esquecer ninguém.",
  "(6) Desafio do Banquete de Ano Novo: Como um chef estressado preparando um banquete de Ano Novo, hoje você enfrentará desafios e precisará manter a calma.",
  "(7) Reflexão de Ano Novo: O dia pede uma pausa para refletir, talvez com um chocolate quente perto da lareira.",
  "(8) Troca de Resoluções Arriscada: Um dia para fazer escolhas, mas cuidado para não acabar com uma troca de resoluções desastrosa.",
  "(9) Surpresa de Ano Novo: Um dia neutro com surpresas inesperadas, como encontrar um presente escondido sob a árvore de Ano Novo.",
  "(10) Criatividade de Ano Novo: Um dia comum, mas perfeito para inovar na decoração ou nos preparativos de Ano Novo.",
  "(11) Espírito de Ano Novo Astuto: Um bom dia para manter a calma e curtir o espírito de Ano Novo com astúcia.",
  "(12) Paz de Ano Novo: Hoje você pode encontrar a paz e a tranquilidade do Ano Novo, como um jantar harmonioso em família.",
  "(13) Bênção do Espírito de Ano Novo: Um dia cheio de sorte e alegria, como acordar e encontrar exatamente o que desejava sob a árvore de Ano Novo.",
  "(14) Sorte na Neve: Espere por mudanças positivas, como uma agradável surpresa no calendário de advento de Ano Novo.",
  "(15) Inspiração de Ano Novo: Um dia para ser criativo e alegre, como criar uma nova tradição de Ano Novo em família.",
  "(16) Aventura no Inverno: Prepare-se para uma aventura positiva, talvez um passeio inesperado para ver as luzes de Ano Novo.",
  "(17) Contratempo na Véspera de Ano Novo: Esteja preparado para qualquer contingência, como uma queda de energia durante o jantar de Ano Novo!",
  "(18) Dia de Neve com Sorte: Como acordar com a notícia de um dia de neve, espere um dia cheio de surpresas e alegrias.",
  "(19) Festa de Ano Novo Vitoriosa: Um dia de conquistas, como completar com sucesso todos os preparativos de Ano Novo.",
  "(20) Absoluta Harmonia de Ano Novo: Um dia abençoado, cheio de paz, harmonia e alegria, como um Ano Novo perfeito em família."
];



bot.command("roll", (ctx) => {
  const roll = randomInt(1, 20);
  ctx.reply(`🎇 ${roll_phrases[roll - 1]}`)
});

bot.command("calibra", (ctx) => {
  let sum = 0;
  let rolls = [];
  
  for (let i = 0; i < 50; i++) {
    const roll = randomInt(1, 20);
    sum += roll;
    rolls.push(roll);
  }

  const average = sum / 50;

  ctx.reply(`\`\`\`Calibrô:\n${rolls.join(', ')}\`\`\`\nAverage: ${average.toFixed(2)}`, { parse_mode: 'Markdown' });
});

// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "roll", description: "tenta a sorte" },
  { command: "calibra", description: "calibra nois" },
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
