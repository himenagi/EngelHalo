import { Bot, Interaction, InteractionResponseTypes, Message } from "@discordeno/mod.ts";
import { SlashCommand, getRandom } from "../common.ts";

interface DropItem {
    name: string,
    price: number,
    num: number,
    notes?: string
}

const quests = [
    "ゴブリン討伐",
    "ウルフ討伐",
    "ボーンアニマル討伐",
    "グリーンマンティス討伐",
    "ジャイアントマンティス討伐",
    "クリサリス討伐",
    "ファイアリザード討伐",
    "ボーンハウンド討伐",
    "プラズマスフィア討伐",
    "ドラゴネット鎮圧",
    "毒霧のキメラ討伐",
    "機械天使ミカエル討伐",
    "レッドメタルマンティス討伐",
    "オメガランチャー討伐",
    "ブラックテンタクル討伐",
    "ワイバーン鎮圧",
    "ワイバーン鎮圧(ハード)",
    "機械天使サリエル討伐"
];

// ?reward
// クエスト報酬の自動化
// 引数: クエストID、PC数
export const reward = (_bot: Bot, message: Message) => {
    const words = message.content.split(" ");
    if (words.length >= 3) {
        const questId = parseInt(words[1]);
        const pcnum = parseInt(words[2]);

        let exp = 0;
        let money = 0;
        const dropItems: DropItem[] = [];
        
        let dropnum = 0;

        switch (questId) {
            case 1:
                // ゴブリン討伐
                exp = 100 + 1 * 10 * 1;
                money = 500;
                break;
            case 2:
                // ウルフ討伐
                exp = 200 + 1 * 10 * (pcnum + 2);
                money = 800;
                break;
            case 3:
                // ボーンアニマル討伐
                exp = 250 + 5 * 10 * pcnum;
                money = 800;
                for (let i = 0; i < pcnum; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "動物の骨", price: 100, num: dropnum });
                }
                break;
            case 4:
                // グリーンマンティス討伐
                exp = 400 + 9 * 10 * pcnum;
                money = 1000;
                for (let i = 0; i < pcnum; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "蟷螂の鎌", price: 200, num: dropnum });
                }
                break;
            case 5:
                // ジャイアントマンティス討伐
                exp = 800 + 9 * 10 * (pcnum - 1) + 10 * 10 * 1;
                money = 1500;
                dropItems.push({ name: "蟷螂の鎌", price: 200, num: 1 });
                for (let i = 0; i < pcnum - 1; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropItems[0].num++;
                    }
                }
                if (getRandom(1, 100) >= 81) {
                    dropItems.push({ name: "蟷螂の翅", price: 1000, num: 1 });
                }
                break;
            case 6:
                // クリサリス討伐
                exp = 900 + 15 * 10 * 1;
                money = 1600;
                if (getRandom(1, 100) >= 51) {
                    dropItems.push({ name: "機械繭の殻の欠片", price: 400, num: 1 });
                }
                break;
            case 7:
                // ファイアリザード討伐
                exp = 1000 + 20 * 10 * pcnum;
                money = 1800;
                for (let i = 0; i < pcnum; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "火蜥蜴の鱗", price: 400, num: dropnum });
                }
                break;
            case 8:
                // ボーンハウンド討伐
                exp = 1000 + 20 * 10 * pcnum;
                money = 1800;
                dropItems.push({ name: "動物の骨", price: 100, num: pcnum });
                break;
            case 9:
                //プラズマスフィア討伐
                exp = 1400 + 20 * 10 * 1;
                money = 1800;
                if (getRandom(1, 100) >= 51) {
                    dropItems.push({ name: "帯電した粉末", price: 400, num: 1 });
                }
                break;
            case 10:
                // ドラゴネット鎮圧
                exp = 1500 + 25 * 10 * 2;
                money = 2000;
                for (let i = 0; i < 2; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "竜の牙", price: 500, num: dropnum });
                }
                break;
            case 11:
                // 毒霧のキメラ討伐
                exp = 1200 + 25 * 10 * pcnum;
                money = 1800;
                for (let i = 0; i < pcnum; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "毒の液体", price: 500, num: dropnum });
                }
                break;
            case 12:
                // 機械天使ミカエル討伐
                exp = 2500 + 30 * 10 * 1;
                money = 2500;
                dropItems.push({ name: "試作型機械天使の核", price: 600, num: 1 });
                dropItems.push({ name: "魔導ブースター", price: 600, num: 1, notes: "脚部破壊時のみ入手" });
                if (getRandom(1, 100) >= 51) {
                    dropItems.push({ name: "魔導刃", price: 800, num: 1 });
                }
                break;
            case 13:
                // レッドメタルマンティス討伐
                exp = 2500 + 30 * 10 * 1;
                money = 2500;
                if (getRandom(1, 100) >= 51) {
                    dropItems.push({ name: "鋼の鋏", price: 900, num: 1 });
                }
                break;
            case 14:
                // オメガランチャー討伐
                exp = 2500 + 30 * 10 * 1;
                money = 2500;
                dropItems.push({ name: "大口径の砲塔", price: 800, num: 1 });
                break;
            case 15:
                // ブラックテンタクル討伐
                exp = 2800 + 30 * 10 * 3;
                money = 2800;
                dropItems.push({ name: "黒い粘液", price: 600, num: 3 });
                break;
            case 16:
                // ワイバーン鎮圧
                exp = 3000 + 40 * 10 * 2;
                money = 3000;
                dropItems.push({ name: "竜の牙", price: 500, num: 2 });
                for (let i = 0; i < 2; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "竜の鋭爪", price: 1000, num: dropnum });
                }
                break;
            case 17:
                // ワイバーン鎮圧(ハード)
                exp = 4000 + 40 * 10 * 4;
                money = 4000;
                dropItems.push({ name: "竜の牙", price: 500, num: 4 });
                for (let i = 0; i < 4; i++) {
                    if (getRandom(1, 100) >= 51) {
                        dropnum++;
                    }
                }
                if (dropnum >= 1) {
                    dropItems.push({ name: "竜の鋭爪", price: 1000, num: dropnum });
                }
                break;
            case 18:
                // 機械天使サリエル討伐
                exp = 3200 + 45 * 10 * 1;
                money = 2500;
                dropItems.push({ name: "試作型機械天使の核", price: 600, num: 1 });
                dropItems.push({ name: "魔導ブースター", price: 600, num: 1, notes: "脚部破壊時のみ入手" });
                if (getRandom(1, 100) < 51) {
                    dropItems.push({ name: "魔導刃", price: 800, num: 1 });
                } else {
                    dropItems.push({ name: "魔導銃", price: 1500, num: 1 });
                }
                break;
        }

        // クエスト報酬を表示
        let text = "";
        if (dropItems.length == 0) {
            text = `${quests[questId - 1]}\n${exp}exp ${money}G\nドロップアイテム: なし`;
        } else {
            const totalMoney = money + dropItems.map(x => x.price * x.num).reduce((sum, element) => sum + element);
            text = `${quests[questId - 1]}\n${exp}exp ${money}G(${totalMoney}G)\nドロップアイテム: ${dropItems.map(x => x.notes ? `${x.name}(売却価格${x.price}G/${x.notes})×${x.num}` : `${x.name}(売却価格${x.price}G)×${x.num}`).join(",")}`;
        }
        _bot.helpers.sendMessage(message.channelId, {
            content: `<@${message.authorId}>\n${"```" + text + "```"}`,
            messageReference: { messageId: message.id, failIfNotExists: false }
        });
    }
}

// /qlist
// クエスト一覧の表示
export const questList: SlashCommand = {
    // コマンド情報
    info: {
        name: "qlist",
        description: "クエストIDとクエスト名の一覧を表示します。"
    },
    // コマンド内容
    response: async (_bot: Bot, interaction: Interaction) => {
        return await _bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: quests.map((x, index) => `${index + 1}: ${x}`).join("\n"),
                flags: 1 << 6
            }
        })
    }
}