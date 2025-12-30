const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  PermissionsBitField 
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

/* =======================
   BOT READY
======================= */
client.once("ready", () => {
  console.log("Vertex RP BOT ON");
});

/* =======================
   COMMANDES
======================= */
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // +help
  if (message.content === "+help") {
    message.reply(
      "**Commandes disponibles :**\n" +
      "`+help` → affiche ce message\n" +
      "`+addrole @user @role` → ajouter un rôle\n" +
      "`+derank @user` → enlever les rôles staff"
    );
  }

  // +addrole
  if (message.content.startsWith("+addrole")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Permission refusée");

    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role)
      return message.reply("❌ Utilisation : +addrole @user @role");

    await member.roles.add(role);
    message.reply(`✅ Rôle **${role.name}** ajouté à **${member.user.tag}**`);
  }

  // +derank (retire tous les rôles sauf @everyone)
  if (message.content.startsWith("+derank")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Permission refusée");

    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ Utilisation : +derank @user");

    const rolesToRemove = member.roles.cache.filter(
      r => r.id !== message.guild.id
    );

    await member.roles.remove(rolesToRemove);
    message.reply(`✅ **${member.user.tag}** a été derank`);
  }
});

/* =======================
   LOGIN (NE PAS MODIFIER)
======================= */
client.login(process.env.DISCORD_TOKEN);
