//Glitch için olan yer
const express = require("express");
const app = express();
const http = require("http");

app.get("/", (request, response) => {
  console.log(
    ` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`
  );
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//Sabitler
const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const db = require("quick.db");
require("./util/eventLoader")(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

//Reklam İsim Ban
client.on("guildMemberAdd", async member => {
  const reklamisim = [
    "discord.gg/",
    "https://discord.gg",
    "invite",
    "join",
    "twitch",
    "instagram",
    "facebook",
    "dlive",
    "nolive",
    "discordbots.org",
    "discordapp"
  ];
  let reklamisimban = await db.fetch(`reklamisimban_${member.guild.id}`);
  if (reklamisimban === "kapali") return;
  if (reklamisimban === "acik") {
    if (reklamisim.some(word => member.user.username.includes(word))) {
      member.ban({
        reason: `isminde reklam olduğundan dolayı banlandı."**Red!Bot**"`
      });
    }
  }
});

//KANAL SİLİNCE ESKİ AYARLARIYLA GERİ AÇMA!
client.on("channelDelete", async channel => {
  const logs = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  const deleter = await channel.guild.members.get(logs.executor.id);
  if (deleter.id == "711166288734453792") return; //bu satıra kendi id'nizi yazın sizin kanal silmenizi engellemeyecektir
  channel
    .clone(undefined, true, true, "Kanal silme koruması sistemi")
    .then(async klon => {
      await klon.setParent(channel.parent);
      await klon.setPosition(channel.position);
    });
});
//ROL SİLİNCE YETKİSİNİ ÇEKME
client.on("roleDelete", async role => {
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  const yetkili = await role.guild.members.get(entry.executor.id);
  const eskihali = role.permissions;
  console.log(eskihali);
  if (yetkili.id === "711166288734453792") return;
  let embed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(
      `<@${yetkili.id}> isimli kişi ${role.id} ID'li rolü sildi ve sahip olduğu tüm rolleri alarak, kendisine \`CEZALI\` rolünü verdim.`
    )
    .setTimestamp();
  let roles = role.guild.members.get(yetkili.id).roles.array();
  try {
    role.guild.members.get(yetkili.id).removeRoles(roles);
  } catch (err) {
    console.log(err);
  }
  setTimeout(function() {
    role.guild.members.get(yetkili.id).addRole("711166288734453792");
    role.guild.owner.send(embed);
  }, 1500);
});

//ROLE YETKİ VERİNCE ÇEKME

client.on("roleUpdate", async function(oldRole, newRole) {
  const bilgilendir = await newRole.guild
    .fetchAuditLogs({ type: "ROLE_UPLATE" })
    .then(hatırla => hatırla.entries.first());
  let yapanad = bilgilendir.executor;
  let idler = bilgilendir.executor.id;
  if (idler === "711166288734453792") return; // yapan kişinin id si bu ise bir şey yapma
  if (oldRole.hasPermission("ADMINISTRATOR")) return;

  setTimeout(() => {
    if (newRole.hasPermission("ADMINISTRATOR")) {
      newRole.setPermissions(newRole.permissions - 8);
    }

    if (newRole.hasPermission("ADMINISTRATOR")) {
      if (
        !client.guilds.get(newRole.guild.id).channels.has("711166288734453792")
      )
        return newRole.guild.owner.send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi** Alındı. \Rol: **${newRole.name}**`
        ); //bu id ye sahip kanal yoksa sunucu sahibine yaz

      client.channels
        .get("711166288734453792")
        .send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi Alındı**. \Rol: **${newRole.name}**`
        ); // belirtilen id ye sahip kanala yaz
    }
  }, 1000);
});

//DDOS KORUMA

client.on("message", msg => {
  if (client.ping > 500) {
    let bölgeler = ["eu-central", "eu-west"];
    let yenibölge = bölgeler[Math.floor(Math.random() * bölgeler.length)];
    let sChannel = msg.guild.channels.find(c => c.name === "ddos-koruma");

    sChannel.send(
      `Sunucu'ya Ddos Atıldığı için \nSunucu Bölgesini Değiştirdim \n __**${yenibölge}**__`
    );
    msg.guild
      .setRegion(yenibölge)
      .then(g => console.log(" bölge:" + g.region))
      .then(g => msg.channel.send("bölge **" + g.region + " olarak değişti"))
      .catch(console.error);
  }
});
//Link Engel
client.on("message", async message => {
  if (message.member.hasPermission("MANAGE_GUILD")) return;
  let links = message.content.match(
    /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi
  );
  if (!links) return;
  if (message.deletable) message.delete();
  message.channel.send(`Hey ${message.author}, sunucuda link paylaşamazsın!`);
});
//Etiket Spam Engel
const { RichEmbed } = require("discord.js");
client.on("message", async message => {
  if (!message.guild) return;
  if (message.member.hasPermission("MANAGE_GUILD")) return;
  if (message.mentions.users.size >= 3) {
    if (message.deletable) message.delete();
    message.channel.send(
      `Hey ${message.author}, sürekli birilerini etiketlemek kötüdür. ${message.author} bir daha devam etme. ${message.author} ${message.author} ${message.author}`
    );
    message.author.send(
      `Hey ${message.author}, sürekli birilerini etiketlemek kötüdür. ${message.author} bir daha devam etme. ${message.author} ${message.author} ${message.author}`
    );
  }
});
client.on("guildMemberRemove", async member => {
  // chimp ᵈ♡#0110
  const data = require("quick.db");

  const da = await data.fetch(`sağ.tık.kick.${member.guild.id}`);
  if (!da) return;
  const kanal_id = await data.fetch(`sağ.tık.kick.kanal.${member.guild.id}`);
  let kanal = client.channels.get(kanal_id);

  let logs = await member.guild.fetchAuditLogs({ type: "MEMBER_KICK" });
  if (logs.entries.first().executor.bot) return;
  let kişi = member.guild.members.get(logs.entries.first().executor.id);
  if (kişi.id === "711166288734453792") return;
  kişi.roles.forEach(r => {
    kişi.removeRole(r.id);
  });

  const emb = new Discord.RichEmbed()
    .setAuthor(kişi.user.username, kişi.user.avatarURL)
    .setFooter(`${client.user.username}`)
    .setTimestamp();

  kanal.send(
    emb.setDescription(
      `${kişi.user.tag} isimli kişi birisini atmaya çalıştı, attı ama ben yetkilerini aldım.`
    )
  );
  member.guild.owner.send(
    emb.setDescription(
      `${kişi.user.tag} isimli kişi birisini atmaya çalıştı, attı ama ben yetkilerini aldım.`
    )
  );
  console.log("Wialinda <3");
}); // codare

client.on("guildBanAdd", async (guild, user) => {
  // chimp ᵈ♡#0110
  const data = require("quick.db");

  const da = await data.fetch(`sağ.tık.ban.${guild.id}`);
  if (!da) return;
  const kanal_id = await data.fetch(`sağ.tık.ban.kanal.${guild.id}`);
  let kanal = client.channels.get(kanal_id);

  let logs = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" });
  if (logs.entries.first().executor.bot) return;
  let kişi = guild.members.get(logs.entries.first().executor.id);
  if (kişi.id === "711166288734453792") return;
  kişi.roles.forEach(r => {
    kişi.removeRole(r.id);
  });
  guild.unban(user);

  const emb = new Discord.RichEmbed()
    .setAuthor(kişi.user.username, kişi.user.avatarURL)
    .setFooter(`${client.user.username}`)
    .setTimestamp();

  kanal.send(
    emb.setDescription(
      `${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`
    )
  );
  guild.owner.send(
    emb.setDescription(
      `${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`
    )
  );
  console.log("Wialinda");
}); // codare
client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    let tag = "⏂"; //Kullandığınız tag
    let sunucu = "732567344085467218"; //Sunucunuzun İD'si
    let kanal = "732583692878217247"; //Mesaj atıalcağı kanal
    let rol = "732567345356341386"; //Rolünüzün İD'si
    if (
      newUser.username.includes(tag) &&
      !client.guilds
        .get(sunucu)
        .members.get(newUser.id)
        .roles.has(rol)
    ) {
      client.channels
        .get(kanal)
        .send(
          `${newUser} ${tag} tagını aldığı için <@&${rol}> rolünü kazandı!`
        );
      client.guilds
        .get(sunucu)
        .members.get(newUser.id)
        .addRole(rol);
    }
    if (
      !newUser.username.includes(tag) &&
      client.guilds
        .get(sunucu)
        .members.get(newUser.id)
        .roles.has(rol)
    ) {
      client.guilds
        .get(sunucu)
        .members.get(newUser.id)
        .removeRole(rol);
      client.channels
        .get(kanal)
        .send(
          `${newUser} ${tag} tagını çıkardığı için <@&${rol}> rolünü kaybetti!`
        );
    }
  }
});

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sa") {
    msg.reply("**Aleyküm selam**");
  }
});

client.on("ready", () => {
  client.channels.get("732567347088588863").join();
});
