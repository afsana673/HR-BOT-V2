# 🍘 HR BOT — Developer SK HABIBULLA

**Messenger Bot with separate commands and Canvas welcome image cards.**

- `sk-habibulla-fca`: `^0.2.0`
- `canvas`: `^3.2.3` (Node 22)
- Works with GitHub + Render/Railway as a long-running Node.js web service, *subject to FCA compatibility*.
- Welcome PNG cards are generated automatically on Messenger `log:subscribe` events when welcome is enabled.
- Group-specific custom prefix stored in `DATA_DIR/settings.json`.

> This is an unofficial Facebook FCA integration. A real login with `sk-habibulla-fca@0.2.0` has **not** been tested; the project assumes the package exports common FCA `login({ appState }, callback)` and `api.listenMqtt()` methods. Your login can fail or the account can be restricted. Never commit appstate cookies or share them with others.

## Structure — every command is independent

```text
HR-BOT-Canvas-Commands/
├── index.js                       # HTTP /health + FCA login
├── package.json                   # npm install includes canvas
├── .node-version                  # Node 22
├── render.yaml                    # optional Render Blueprint
├── railway.json                   # Railway deploy
├── .env.example
├── appstate.example.json
├── appstate.json                  # empty local template; DO NOT COMMIT credentials
├── apostate.json                  # empty local template; DO NOT COMMIT credentials
├── src/
│   ├── bot.js                     # command/event dispatcher
│   ├── commands/
│   │   ├── index.js               # loader ONLY, no command implementations
│   │   ├── _utils.js
│   │   ├── help.js
│   │   ├── ping.js
│   │   ├── prefix.js
│   │   ├── welcome.js
│   │   ├── goodbye.js
│   │   ├── antilink.js
│   │   ├── antiunsend.js
│   │   ├── kick.js
│   │   ├── ban.js
│   │   ├── unban.js
│   │   ├── nickname.js
│   │   ├── react.js
│   │   ├── unsend.js
│   │   ├── uid.js
│   │   ├── admin.js
│   │   ├── uptime.js
│   │   ├── info.js
│   │   ├── echo.js
│   │   ├── settings.js
│   │   └── threadinfo.js
│   ├── events/
│   │   ├── welcome.js             # subscribe event: PNG image attachment
│   │   └── goodbye.js
│   └── lib/
│       ├── welcome-card.js        # Canvas card design
│       ├── avatar.js              # optional Facebook avatar download
│       ├── fca.js, auth.js, store.js
└── tests/
    ├── bot.test.js
    └── welcome.test.js
```

## Commands

| Command | Description | Who |
|---|---|---|
| `!help` | All available commands | Everyone |
| `!prefix` / `prefix` | See prefix | Everyone |
| `!prefix set #` / `#prefix reset` | Change/reset chat prefix | Group admin or bot admin |
| `!ping`, `!uptime`, `!info` | Status | Everyone |
| `!uid`, `!admin`, `!echo hi` | ID/admin/echo | Everyone |
| `!threadinfo`, `!settings` | Group info/settings | Everyone |
| `!welcome on` | Turn on automatic Canvas welcome cards | Group admin |
| `!welcome off` | Turn off automatic welcome | Group admin |
| `!welcome test` | Send a preview welcome card for yourself | Group admin |
| `!goodbye on/off` | Goodbye message | Group admin |
| `!antilink on/off` | Enable/disable link warning | Group admin |
| `!antiunsend on/off` | Enable/disable short text unsend notice | Group admin |
| `!kick` (reply/mention/UID) | Remove group member | Group admin |
| `!ban UID`, `!unban UID` | Block user from bot commands | Bot admin |
| `!nickname Name`, `!react ❤️`, `!unsend` | Nickname, reaction, unsend own bot reply | Everyone |

The prefix can change independently per group. `welcome` defaults **ON** and sends one premium 1200×600 PNG for each newly added member (up to 10 per event), with the person's name, group name, member number if available, and profile avatar if FCA provides a usable Facebook-hosted URL. If avatar download fails, the card uses their initial. If Canvas rendering or upload fails, the bot sends a plain text welcome instead. Welcome cards are generated in memory and temporary PNGs are removed after upload.

## Deploy to Render

1. Extract ZIP; upload files (not the containing folder) to a **private GitHub repository**. Do not upload live `appstate.json`, `apostate.json`, or `.env`.
2. Render Dashboard → New → Web Service → Connect GitHub repository. Select a Node runtime and your preferred instance plan.
3. Set **Root Directory** empty if `package.json` is at repository root.
4. **Build Command:** `npm install` (installs `canvas` automatically).
5. **Start Command:** `npm start` (or `node index.js`).
6. Add private environment variables:

   | Key | Value |
   |---|---|
   | `APPSTATE_JSON` | Your own complete FCA AppState JSON array, stored as a SECRET |
   | `ADMIN_UIDS` | Your Facebook numeric ID (comma-separated for multiple admins) |
   | `PREFIX` | `!` |
   | `NODE_ENV` | `production` |
   | `ALLOW_GROUP_ADMINS` | `true` |
   | `DATA_DIR` | `./data` (ephemeral) or path of persistent storage |

7. Deploy. Open `https://your-service.onrender.com/health` or check logs for `[FCA] HR BOT 🍘 logged in.`
8. In a Messenger group, send `!welcome test` as a group admin, then `!welcome on` to turn on cards.

If you use Render's free tier (where available), service sleep/spin-down may interrupt the MQTT listener; use an always-on instance for a continuous bot. Local settings/prefixes can disappear after redeploy unless stored in a persistent disk/volume. Native `canvas` install may need Cairo/Pango system dependencies if no compatible prebuilt binary is available.

## Deploy to Railway

Deploy the same GitHub repo with `npm install` + `npm start`. Add the variables listed above. Mount a persistent volume and set `DATA_DIR` to that mount if you want prefixes/settings to survive restarts.

## Local setup

```bash
npm install
npm test
npm start
```

`npm install` is sufficient; you do not need a second `npm install canvas` command, because the dependency is in `package.json`. You can also install manually with `npm install canvas@^3.2.3`.

## How to customize

- Change command replies inside `src/commands/<command>.js`.
- Add a new command `.js` file that exports `(add) => add(name, description, syntax, role, handler)`. It loads automatically from `src/commands/`.
- Customize colors, fonts, and layout inside `src/lib/welcome-card.js`.
- Customize new-member event handling inside `src/events/welcome.js`.
- `src/commands/index.js` is intentionally only a loader.

**Note:** Commands which change a group require the Facebook account/API to have permission. `antilink` warns but does not delete messages. `antiunsend` caches opted-in text in memory for up to five minutes; respect group members' privacy. Using the personal-login cookie flow may violate Meta rules and risks restrictions. Prefer official APIs where feasible.

© HR BOT 🍘 — Developer SK HABIBULLA
