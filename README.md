<br/>

<div align="center" style="margin: 30px;">
<a href="https://aoi.js.org/">
  <img src="https://github.com/aoijs/website/blob/master/assets/images/aoijs-banner.png?raw=true"   style="width:350px;" align="center"  alt="aoi.js"/>
</a>
<br />
<br />

<div align="center"><strong>aoi.js Official Documentation</strong><br />
<div align="center">
    <a href="https://aoi.js.org/invite">Discord</a> |
    <a href="https://aoi.js.org/">Documentation</a> <br /> <br />
</div>
</div>
<br />
</div>

## ❓ What is aoi.js?

aoi.js is a JavaScript library that is designed to make it easy to build Discord bots. It is open-source and free to
use, and provides a simple, easy-to-use interface for interacting with the Discord API and handling events. aoi.js is
suitable for beginners who are new to building bots, as well as experienced developers who want to save time and
streamline their workflow.

## 🚀 Setup

```javascript
const { AoiClient } = require("aoi.js");

const client = new AoiClient({
    token: "Discord Bot Token",
    prefix: "Discord Bot Prefix",
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    database: {
        type: "aoi.db",
        db: require("@aoijs/aoi.db"),
        dbType: "KeyValue",
        tables: ["main"],
        securityKey: "a-32-characters-long-string-here"
    }
});

// Ping Command
client.command({
  name: "ping",
  code: `Pong! $pingms`
});
```

### Interaction Command Setup

```javascript
const { AoiClient } = require("aoi.js");

const client = new AoiClient({
    token: "Discord Bot Token",
    prefix: "Discord Bot Prefix",
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    database: {
        type: "aoi.db",
        db: require("@aoijs/aoi.db"),
        dbType: "KeyValue",
        tables: ["main"],
        securityKey: "a-32-characters-long-string-here"
    }
});

// Create Interaction Ping Command
client.command({
  name: "create",
  code: `$createApplicationCommand[$guildID;ping;Pong!;true;true;slash]`
});
```

## 🐛 Contribution

[Refer to contribution documentation for more information](https://github.com/aoijs/aoi.js/blob/v6/.github/CONTRIBUTING.md)

### 🧑‍💻 Aoi.js

[![aoijs/aoi.js](https://contrib.rocks/image?repo=aoijs/aoi.js)](https://github.com/aoijs/aoi.js)

### 📄 Documentation

[![aoijs/website](https://contrib.rocks/image?repo=aoijs/website)](https://github.com/aoijs/website)

## 🏃‍♂️ Cómo ejecutar la web localmente

Esta documentación está construida con [Astro](https://astro.build/) y Starlight, e incluye la página de analítica estilo vidIQ en `/tools/vidiq`.

1. Instala Node 18+ y NPM.
2. Descarga las dependencias (es normal ver avisos de _peer dependencies_ en este proyecto):
   ```bash
   npm install
   ```
   Si tu red devuelve un `403 Forbidden` al resolver `@astrojs/starlight`, configura el registro predeterminado y vuelve a intentar:
   ```bash
   npm config set registry https://registry.npmjs.org
   npm install
   ```
   En entornos con políticas estrictas de dependencias, `npm install --legacy-peer-deps` puede ayudar a instalar a pesar de los avisos.
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:4321/tools/vidiq](http://localhost:4321/tools/vidiq) para ver el panel de analítica tipo vidIQ.
