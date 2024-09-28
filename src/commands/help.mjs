import * as utility from "../utility.mjs";
import * as config from "../../include/config.mjs";
import { EmbedBuilder } from "discord.js";
import fs from 'fs/promises';

export async function helpMenu(message, parsedCommand) {
    try {
        console.log(process.cwd());
        const result = await fs.readFile("include/help.json", "utf-8");

        if (!result) {
            return;
        }
        const helpJson = JSON.parse(result); 
        const helpEmbed = await getHelpEmbed(message, helpJson); 

        message.reply({embeds: [helpEmbed]});
    } catch (error) {
        console.error(utility.getErrorMessage("help.mjs l16", error));
    }
}

async function getHelpEmbed(message, helpJson) {
    const embed = new EmbedBuilder(config.helpEmbed);
    const botUser = await message.guild.members.fetch("1287503604454002791");

    helpJson.forEach(command => {
        embed.addFields(
            {name: `${config.prefix}${command.name}`, value: `${command.description}`}
        );
    });
    embed
        .setThumbnail(botUser.displayAvatarURL())
        .setColor(utility.fetchRandomEmbedColor());
    return embed;
}