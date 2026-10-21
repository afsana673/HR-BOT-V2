'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const {getTarget} = require('./_utils');
module.exports = add => add('unban', 'Unban a user', 'unban <uid>', 'bot-admin', async c => {
  const target = getTarget(c.msg, c.args[0]);
  if (!target) return c.reply('Specify UID.');
  c.store.setBan(target, false);
  return c.reply(`Unbanned UID ${target}.`);
});
