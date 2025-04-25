import { EmbedBuilder, PermissionsBitField } from "discord.js";

export const prefix = "!";

export const permissionTable = {
  clear: [PermissionsBitField.Flags.ManageMessages],
  setentry: [PermissionsBitField.Flags.ManageRoles],
  removeentry: [PermissionsBitField.Flags.ManageRoles],
  setwallet: [PermissionsBitField.Flags.CreateEvents],
  givemoney: [PermissionsBitField.Flags.CreateEvents],
  takemoney: [PermissionsBitField.Flags.CreateEvents]
};

export const sbdRoles = [
    { maxSbd: 50, roleId: "1157666220825382952" },  // Beginner 👶
    { maxSbd: 100, roleId: "1157666190110511134" }, // Novice 🟢
    { maxSbd: 150, roleId: "1157666158057619496" }, // Intermediate ⚪
    { maxSbd: 200, roleId: "1157666107096846346" }, // Advanced 🔵
    { maxSbd: 250, roleId: "1157666068454715432" }, // Expert ⭐
    { maxSbd: 300, roleId: "1157665963341254668" }, // Elite 🏆
    { maxSbd: 400, roleId: "1289208448520687730" }, // Champion 🔥
    { maxSbd: 500, roleId: "1289208764112703528" }, // Legend 👑
    { maxSbd: 600, roleId: "1289208897264947253" }, // Mythical 🌟
    { maxSbd: Infinity, roleId: "1289209218351497330" } // Godlike 🔱 (for 600+ kg)
];

export const infoEmbed = new EmbedBuilder()
  .setColor("Red")
  .setTitle('lookupEmebed')
  .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
  .setDescription('Some description here')
  .setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true },
  )
  .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  .setImage('https://i.imgur.com/AfFp7pu.png')
  .setTimestamp()
  .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

export const exerciseEmbed = new EmbedBuilder()
  .setColor("Blue")
  .setTitle("exerciseName")
  .setDescription("exerciseDescription");

export const leaderboardEmbed = new EmbedBuilder()
  .setColor("Yellow")
  .setTitle("Epilift leaderboard :trophy:")
  .setFooter({ text: "Please, contact Loris to be added to the leaderboard :)"})
  .setTimestamp();

export const lookUpEmbed = new EmbedBuilder()
  .setColor("Blue")
  .setTitle("Lookup result :mag:")
  .setTimestamp();

export const walletEmbed = new EmbedBuilder()
  .setColor("Fuchsia")
  .setTitle("Wallet")
  .setTimestamp();

export const helpEmbed = new EmbedBuilder()
  .setTitle("Epilift bot help :robot:")
  .setTimestamp();

export const progressionEmbed = new EmbedBuilder()
  .setColor("Blue")
  .setTitle("Progression :emoji_5:")
  .setTimestamp()
  .setFooter({ text: "Keep up the good work!"})