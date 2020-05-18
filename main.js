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
      rcon_request: {
        address: process.env.RCON_ADDRESS,
        password: process.env.RCON_PASSWORD,
        command: cmd
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
  if (msg.content === '%help') {
    text = `Help contents:
> %status                 - get server status
> %workshop <id number>   - switch to specified workshop map
> %changelevel <map name> - switch to specified map
> %rcon <arg1> <argN>     - raw command interface
> %surf <optional:speed>  - run commands to turn on surfing. Speed defaults to 800
`
    msg.reply("```" + text + "```");
  }
});

// Status command
client.on('message', msg => {
  if (msg.content === '%status') {
    var cmd = "status";
    command(cmd, function(resp){
      msg.reply('Fetching server status!\n' + "```" + resp.data.rcon_response.output + "```");
    });
  }
});

// change level command
client.on('message', msg => {
  if (msg.content.startsWith('%changelevel')) {
    var map_name = msg.content.split(" ")[1]
    var cmd  = "changelevel " + map_name
    command(cmd, function (response) {
      msg.reply('Changing map to ' + map_name + '!\n' + "```" + response.data.rcon_response.output + "```");
    })
  }
});


// workshop command
client.on('message', msg => {
  if (msg.content.startsWith('%workshop')) {
    var workshop_map_number = msg.content.split(" ")[1]
    var cmd = "host_workshop_map " + workshop_map_number
    command(cmd, function (response) {
      msg.reply('Changing map to ' + workshop_map_number + '!\n' + "```" + response.data.rcon_response.output + "```");
    })
  }
});


// raw command
client.on('message', msg => {
  if (msg.content.startsWith('%rcon')) {
    var command_strings = msg.content.split(" ").slice(1,40) // just a big number
    var cmd = command_strings.join(" ");
    command(cmd, function (response) {
      if (response.data.rcon_response.output.length > 0) {
        msg.reply('Raw Command: `' + cmd + '`\n' + "```" + response.data.rcon_response.output + "```");
      } else {
        msg.reply('Raw Command: `' + cmd + '`!\n');
      }
    });
  }
});


// surfmode command
client.on('message', msg => {
  if (msg.content.startsWith('%surf')) {
    var air_accel = msg.content.split(" ")[1]
    cmds = [
      // Enable cheats
      "sv_cheats 1",
      //noclip humans
      "mp_solid_teammates 0",
      //respawns
      "mp_respawn_on_death_ct 1",
      "mp_respawn_on_death_t 1",
      // enable bunnyhopping
      "sv_enablebunnyhopping 1",
      "sv_staminamax 0",
      "sv_staminajumpcost 0",
      "sv_staminalandcost 0",
      "sv_staminarecoveryrate 0",
      // any weapon surf
      "sv_accelerate_use_weapon_speed 0",
      // round time hacks
      "mp_roundtime 999999",
      "mp_timelimit 999999",
      "mp_round_restart_delay 0",
      "mp_roundtime_deployment 0",
      "endround", //round time take effect now
      "bot_kick all", //no bots
      "sv_accelerate 10",
    ]

    if (air_accel != undefined) {
      cmds.push("sv_airaccelerate " + air_accel);
    } else {
      cmds.push("sv_airaccelerate 800");
    }
    cmds.forEach(function(cmd) {
      command(cmd, function (response) {
        if (response.data.rcon_response.output.length > 0) {
          msg.reply('Installed surf setting: `' + cmd + '`\n' + "```" + response.data.rcon_response.output + "```");
        } else {
          msg.reply('Installed surf setting: `' + cmd + '`\n');
        }
      });
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
