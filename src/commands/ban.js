'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const {getTarget} = require('./_utils');
module.exports = add => add('ban', 'Ban a user from bot commands', 'ban <reply|uid>', 'bot-admin', async c => {
  const target = getTarget(c.msg, c.args[0]);
  if (!target || c.admins.has(target) || target === c.botUID) return c.reply('Specify a non-admin UID.');
  c.store.setBan(target, true);
  return c.reply(`Banned UID ${target} from commands.`);
});
