const Discord = require('discord.js');
exports.run = function(client, message, args) {
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Bu komutu kullanmak için izniniz yok!");
if(!args[0]) return message.channel.send(`Lütfen silinecek mesaj miktarını yazın.`);
message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`${args[0]} Adet mesaj silindi. <a:tik1:735520694791700613> `).then(msg => msg.delete(5000));
})
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sil','temizle','süpür'],
  permLevel: 2,
};

exports.help = {
  name:'sil',
  description: 'Belirlenen miktarda mesajı siler.',
  usage: 'sil <silinicek mesaj sayısı>'
};