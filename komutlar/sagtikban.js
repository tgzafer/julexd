const Discord = require('discord.js');
const data = require('quick.db')
exports.run = async (client, message, args) => {// chimp ᵈ♡#0110


let prefix = 's!'// botun prefixi
const emb = new Discord.RichEmbed()
.setAuthor(client.user.username, client.user.avatarURL)
.setFooter(`${client.user.username}`)
.setTimestamp()
.setColor('BLUE')

if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(emb.setDescription(`Bu komutu kullanabimek için Yönetici yetkisine sahip olman gerekiyor.`))
if(!args[0]) return message.channel.send(emb.setDescription(`Bir argüman girmelisin: ${prefix}sağ-tık-ban aç/kapat/ayarla/sıfırla`))

if(args[0] === 'aç') {
const da = await data.fetch(`sağ.tık.ban.${message.guild.id}`)
if(da) return message.channel.send(emb.setDescription(`Sistem zaten açık.`))
const daa = await data.fetch(`sağ.tık.ban.kanal.${message.guild.id}`)
if(!daa) return message.channel.send(emb.setDescription(`Sistemin kanalı ayarlanmamış: ${prefix}sağ-tık-ban ayarla #kanal`))

data.set(`sağ.tık.ban.${message.guild.id}`, 'codare')
message.channel.send(emb.setDescription(`Sistem aktif edildi: Sağ tık ban atmaya çalışanların yetkisini alacağım.`)) }


if(args[0] === 'kapat') {
const da = await data.fetch(`sağ.tık.ban.${message.guild.id}`)
if(!da) return message.channel.send(emb.setDescription(`Sistem zaten kapalı.`))
const daa = await data.fetch(`sağ.tık.ban.kanal.${message.guild.id}`)
if(!daa) return message.channel.send(emb.setDescription(`Sistemin kanalı ayarlanmamış: ${prefix}sağ-tık-ban ayarla #kanal`))
  
data.delete(`sağ.tık.ban.${message.guild.id}`)
message.channel.send(emb.setDescription(`Sistem de-aktif edildi: Sağ tık ban atmaya çalışanların yetkisini artık almayacağım.`)) }


if(args[0] === 'ayarla') {
const daa = await data.fetch(`sağ.tık.ban.kanal.${message.guild.id}`)
if(daa) return message.channel.send(emb.setDescription(`Sistemin kanalı ayarlanmış <#${daa}>: ${prefix}sağ-tık-ban sıfırla`))

let kanal = message.mentions.channels.first()
if(!kanal) return message.channel.send(emb.setDescription(`Bir kanal etiketlemelisin.`))

await data.set(`sağ.tık.ban.kanal.${message.guild.id}`, kanal.id)
message.channel.send(emb.setDescription(`Sistemin kanalı ${kanal} olarak ayarlandı: Sağ tık ban atmaya çalışanların yetkisini aldığım da kanala mesaj göndereceğim ve ban atılanın banını açacağım..`)) }


if(args[0] === 'sıfırla') {
const da = await data.fetch(`sağ.tık.ban.${message.guild.id}`)
if(!da) return message.channel.send(emb.setDescription(`Sistem kapalı, o yüzden sıfırlayamıyorum.`))
const daa = await data.fetch(`sağ.tık.ban.kanal.${message.guild.id}`)
if(!daa) return message.channel.send(emb.setDescription(`Sistemin kanalı ayarlanmamış: ${prefix}sağ-tık-ban ayarla #kanal`))
  
message.channel.send(emb.setDescription(`Sistemin <#${daa}> olan kanalı sıfırlandı: Sağ tık ban atmaya çalışanların yetkisini aldığım da kanala mesaj göndermeyeceğim..`)) 
data.delete(`sağ.tık.ban.kanal.${message.guild.id}`)}

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sağtıkban'],
  permLevel: 0
};

exports.help = {
  name: 'sağ-tık-ban'
};// codare