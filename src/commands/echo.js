'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
module.exports = add => add('echo', 'Repeat text', 'echo <text>', 'user', async c => c.reply(c.args.join(' ').slice(0, 1000) || `Usage: ${c.prefix}echo <text>`));
