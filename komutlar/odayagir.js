const Discord = require('discord.js')

exports.run = async (client, message, args) => {
   const channelID = args.join(" ");
   const channel = client.channels.get(channelID);
   channel.join()
      .then(connection => {
         message.channel.send("Ses Kanalına Başarıyla Katıldım.");
      });
};
exports.conf = {
   enabled: true,
   guildOnly: false,
   aliases: [],
   permLevel: 3
};
exports.help = {
   name: "katıl",
   category: "yetkili",
   description: "Bot Sesli Kanala Katılır.",
   usage: "katıl [kanalid]"
};