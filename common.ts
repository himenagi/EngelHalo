import { Bot, CreateSlashApplicationCommand, Interaction } from "@discordeno/mod.ts";

export interface SlashCommand {
    info: CreateSlashApplicationCommand,
    response(_bot: Bot, interaction: Interaction): Promise<void>
}

export const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;