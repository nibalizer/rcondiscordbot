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

function command(cmd, cb) {
  axios.post(process.env.RCONWEBAPI_URL, {
      RconRequest: {
        Address: process.env.RCON_ADDRESS,
        Password: process.env.RCON_PASSWORD,
        Command: cmd
      }
    })
    .then(function (response) {
      cb(response)
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Status command
client.on('message', msg => {
  if (msg.content === '%status') {
    var cmd = "status";
    command(cmd, function(resp){
      msg.reply('Fetching server status!\n' + "```" + resp.data.RconResponse.Output + "```");
    });
  }
});

// change level command
client.on('message', msg => {
  if (msg.content.includes('%changelevel')) {
    var map_name = msg.content.split(" ")[1]
    var cmd  = "changelevel " + map_name
    command(cmd, function (response) {
      msg.reply('Changing map to ' + map_name + '!\n' + "```" + response.data.RconResponse.Output + "```");
    })
  }
});


// workshop command
client.on('message', msg => {
  if (msg.content.includes('%workshop')) {
    var workshop_map_number = msg.content.split(" ")[1]
    var cmd = "host_workshop_map " + workshop_map_number
    command(cmd, function (response) {
      msg.reply('Changing map to ' + workshop_map_number + '!\n' + "```" + response.data.RconResponse.Output + "```");
    })
  }
});


// raw command
client.on('message', msg => {
  if (msg.content.startsWith('%rcon')) {
    var command_strings = msg.content.split(" ").slice(1,40) // just a big number
    var cmd = command_strings.join(" ");
    command(cmd, function (response) {
      if (response.data.RconResponse.Output.length > 0) {
        msg.reply('Raw Command: `' + cmd + '`\n' + "```" + response.data.RconResponse.Output + "```");
      } else {
        msg.reply('Raw Command: `' + cmd + '`!\n');
      }
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
