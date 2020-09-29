const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const settings = require('../ayarlar.json');

var prefix = settings.prefix;

module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ONLİNE`);
  
  client.user.setStatus("online");
  var game = [
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    "Wialinda❤️Sea",
    


    ];

    setInterval(function() {

        var random = Math.floor(Math.random()*(game.length-0+1)+0);

        client.user.setGame(game[random], "https://www.twitch.tv/kendinemuzisyen");
        }, 2 * 2500);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT ONLİNE.`);
				  
				  
};