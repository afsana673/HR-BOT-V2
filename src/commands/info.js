'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const {startedAt, fmtDur} = require('./_utils');
module.exports = add => add('info', 'Bot details', 'info', 'user', async c => c.reply(`🍘 HR BOT\nDeveloper: SK HABIBULLA\nPrefix: ${c.prefix}\nPlatform: Messenger FCA\nUptime: ${fmtDur(Date.now() - startedAt)}`));
