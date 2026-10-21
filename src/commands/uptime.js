'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const {startedAt, fmtDur} = require('./_utils');
module.exports = add => add('uptime', 'Bot uptime', 'uptime', 'user', async c => c.reply(`🍘 Uptime: ${fmtDur(Date.now() - startedAt)}`));
