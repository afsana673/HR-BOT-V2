'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
module.exports = add => add('nickname', 'Set your nickname', 'nickname <new name>', 'user', async c => {
  if (!c.isGroup) return c.reply('Group-only command.');
  const name = c.args.join(' ').trim();
  if (!name || name.length > 60) return c.reply('Nickname must be 1–60 characters.');
  await F.nickname(c.api, name, c.threadID, c.senderID);
  return c.reply('Nickname updated.');
});
