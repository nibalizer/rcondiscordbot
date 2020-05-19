# Discord Bot for CS:GO

This bot connects to your `rcon` on a private server and controls it from Discord.

## Part of the Rcon Family of tools

- <https://github.com/chromakode/rconwebui>
- <https://github.com/greghaynes/rconwebapi>
- <https://github.com/nibalizer/rcondiscordbot>

## Commands


```
> %status                 - get server status
> %workshop <id number>   - switch to specified workshop map
> %changelevel <map name> - switch to specified map
> %rcon <arg1> <argN>     - raw command interface
> %surf <optional:speed>  - run commands to turn on surfing. Speed defaults to 800
```


## Quick Start

- Create and source config file

```
cp example.env.sh env.sh
vim env.sh
. env.sh
```

- Install dependencies

```
npm install
```

- Run

```
npm start
```
