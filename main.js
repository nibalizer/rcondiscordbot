const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

// Status command
client.on('message', msg => {
  if (msg.content === '%status') {
  axios.post(process.env.RCONWEBAPI_URL, {
      RconRequest: {
        Address: process.env.RCON_ADDRESS,
        Password: process.env.RCON_PASSWORD,
        Command: "status"
      }
    })
    .then(function (response) {
      msg.reply('Fetching server status!\n' + "```" + response.data.RconResponse.Output + "```");
    })
    .catch(function (error) {
      console.log(error);
    });
  }
});

// change level command
client.on('message', msg => {
  if (msg.content.includes('%changelevel')) {
    var map_name = msg.content.split(" ")[1]
    axios.post(process.env.RCONWEBAPI_URL, {
        RconRequest: {
          Address: process.env.RCON_ADDRESS,
          Password: process.env.RCON_PASSWORD,
          Command: "changelevel " + map_name
        }
      })
      .then(function (response) {
        msg.reply('Changing map to ' + map_name + '!\n' + "```" + response.data.RconResponse.Output + "```");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});


// workshop command
client.on('message', msg => {
  if (msg.content.includes('%workshop')) {
    var workshop_map_number = msg.content.split(" ")[1]
    axios.post(process.env.RCONWEBAPI_URL, {
        RconRequest: {
          Address: process.env.RCON_ADDRESS,
          Password: process.env.RCON_PASSWORD,
          Command: "host_workshop_map " + workshop_map_number
        }
      })
      .then(function (response) {
        msg.reply('Changing map to ' + workshop_map_number + '!\n' + "```" + response.data.RconResponse.Output + "```");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});


client.login(process.env.DISCORD_TOKEN);
