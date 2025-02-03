import { Bot, Message } from "@discordeno/mod.ts";

interface IntervalInfo {
    name: string,
    interval: number,
    prevCount: number
};

// ?iset
// インターバル情報の登録
// 引数：キャラクター名、インターバル
export const setInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    const words = message.content.split(" ");
    if (words.length >= 3) {
        // 登録済の最大IDを取得
        const maxiid = (await kv.get<number>(["maxiid"])).value;

        // IDを作成
        const id = maxiid == null ? 1 : maxiid + 1;

        // 重複していなければ登録
        const intervalInfo = { name: words[1], interval: parseInt(words[2]), prevCount: 0 };
        await kv.set([id.toString()], intervalInfo);

        // 登録済の最大IDを更新
        await kv.set(["maxiid"], id);

        _bot.helpers.sendMessage(message.channelId, { content: "登録しました。", messageReference: { messageId: message.id, failIfNotExists: false } });
    }
}

// ?ishow
// インターバル情報の表示
export const showInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    // 登録済の最大IDを取得
    const maxiid = (await kv.get<number>(["maxiid"])).value;
    if (maxiid == null) {
        _bot.helpers.sendMessage(message.channelId, { content: "インターバル情報が登録されていません。", messageReference: { messageId: message.id, failIfNotExists: false } });
        return;
    }

    // インターバル情報一覧を作成
    const intervalInfos = [];
    for (let i = 1; i <= maxiid; i++) {
        const intervalInfo = (await kv.get<IntervalInfo>([i.toString()])).value ?? { name: "", interval: undefined, prevCount: undefined };
        intervalInfos.push(`ID: ${i} キャラクター名: ${intervalInfo.name} インターバル: ${intervalInfo.interval}`);
    }

    _bot.helpers.sendMessage(message.channelId, { content: intervalInfos.join("\n"), messageReference: { messageId: message.id, failIfNotExists: false } });
}

// ?istart
// インターバル管理の開始
export const startInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    // カウントを0にリセット
    await kv.set(["count"], 0);
    _bot.helpers.sendMessage(message.channelId, { content: "インターバル管理を開始します。", messageReference: { messageId: message.id, failIfNotExists: false } });
}

// ?ichange
// インターバル変動
// 引数：ID、変更後のインターバル
export const changeInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    const words = message.content.split(" ");
    if (words.length >= 3) {
        // 変更前のインターバル情報を取得
        const intervalInfo = (await kv.get<IntervalInfo>([words[1]])).value ?? { interval: 0, prevCount: 0 };

        // インターバル情報を更新
        intervalInfo.interval = parseInt(words[2]);
        await kv.set([words[1]], intervalInfo);
        _bot.helpers.sendMessage(message.channelId, { content: "インターバルを変更しました。", messageReference: { messageId: message.id, failIfNotExists: false } });
    }
}

// ?inext
// 次に手番を迎えるキャラクターとその時点のカウントを取得
export const nextInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    // 現在のカウントを取得
    let count = (await kv.get<number>(["count"])).value ?? 0;

    // 登録済の最大IDを取得
    const maxiid = (await kv.get<number>(["maxiid"])).value ?? 0;

    // インターバル情報を取得
    const intervals = [];
    for (let i = 1; i <= maxiid; i++) {
        const intervalInfo = (await kv.get<IntervalInfo>([i.toString()])).value;
        if (intervalInfo != null) {
            // 次回手番のカウントを計算
            let nextCount = intervalInfo.prevCount + intervalInfo.interval;
            nextCount = nextCount < count ? count : nextCount;

            intervals.push({ id: i, info: intervalInfo, nextCount: nextCount });
        }
    }

    // 次の手番のIDを検索
    const turnIds: number[] = [];
    do {
        for (let i = 0; i < intervals.length; i++) {
            if (intervals[i].nextCount == count) {
                turnIds.push(intervals[i].id);
            }
        }

        if (turnIds.length >= 1) {
            break;
        }

        count++;
    } while (true);

    // カウントを更新
    await kv.set(["count"], count);

    // prevCountを更新、手番者名を取得
    const names = [];
    for (let i = 0; i < turnIds.length; i++)
    {
        const intervalInfo = intervals.find(x => x.id == turnIds[i])?.info ?? { name: "", interval: 0, prevCount: 0 };
        intervalInfo.prevCount = count;
        names.push(intervalInfo.name);
        await kv.set([turnIds[i].toString()], intervalInfo);
    }

    // 現在カウントと手番を迎えたIDを表示
    _bot.helpers.sendMessage(message.channelId, { content: `カウント: ${count} 手番者: ${names.join(",")}`, messageReference: { messageId: message.id, failIfNotExists: false } });
}

// ?iend
// インターバル管理の終了
export const endInterval = async (_bot: Bot, message: Message, kv: Deno.Kv) => {
    // 削除するキー一覧
    const keys = ["count", "maxiid"];

    // 登録済の最大IDを取得
    const maxiid = (await kv.get<number>(["maxiid"])).value;

    // 削除するキー一覧にIDを追加
    if (maxiid != null) {
        for (let i = 1; i <= maxiid; i++) {
            keys.push(i.toString());
        }
    }

    // インターバル関連情報を削除
    for (let i = 0; i < keys.length; i++) {
        await kv.delete([keys[i]]);
    }

    _bot.helpers.sendMessage(message.channelId, { content: "インターバル管理を終了しました。", messageReference: { messageId: message.id, failIfNotExists: false } });
}