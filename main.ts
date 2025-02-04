import { createBot, getBotIdFromToken, startBot, Intents } from "@discordeno/mod.ts";
import "$std/dotenv/load.ts";

import { setInterval, startInterval, endInterval, nextInterval, changeInterval, showInterval } from "./commands/interval_management.ts"
import { questList, reward } from "./commands/reward.ts";

// Deno KVを開く
const kv: Deno.Kv = await Deno.openKv();

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

// ボットの作成
const bot = createBot({
    token: BotToken,
    botId: getBotIdFromToken(BotToken) as bigint,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    // イベント発火時に実行する関数など
    events: {
        // 起動時
        ready: (_bot, payload) => {
            console.log(`${payload.user.username} is ready!`);
        },
        // ユーザーによるメッセージ投稿時
        messageCreate: async (_bot, message) => {
            if (message.content.startsWith("?iset")) {
                await setInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?ishow")) {
                await showInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?istart")) {
                await startInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?ichange")) {
                await changeInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?inext")) {
                await nextInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?iend")) {
                await endInterval(_bot, message, kv);
            }
            if (message.content.startsWith("?reward")) {
                await reward(_bot, message);
            }
        },
        // スラッシュコマンド受信時
        interactionCreate: async (_bot, interaction) => {
            if (interaction.data?.name === "qlist") {
                await questList.response(_bot, interaction);
            }
        }
    }
});

// スラッシュコマンドの作成
bot.helpers.createGlobalApplicationCommand(questList.info);

// スラッシュコマンドの登録
bot.helpers.upsertGlobalApplicationCommands([questList.info]);

await startBot(bot);

Deno.cron("Continuous Request", "*/2 * * * *", () => {
    console.log("running...");
});