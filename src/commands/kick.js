'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
const {getTarget} = require('./_utils');
module.exports = add => add('kick', 'Remove a group member', 'kick <reply|mention|uid>', 'group-admin', async c => {
  if (!c.isGroup) return c.reply('Group-only command.');
  const target = getTarget(c.msg, c.args[0]);
  if (!target) return c.reply('Reply, mention, or provide a user UID.');
  if (target === c.botUID || c.admins.has(target) || target === c.senderID) return c.reply('Cannot remove bot/admin/self.');
  const info = await F.getThreadInfo(c.api, c.threadID);
  if ((info.adminIDs || []).some(x => String(x.id ?? x) === target)) return c.reply('Cannot remove a group admin.');
  await F.removeUser(c.api, target, c.threadID);
  return c.reply(`Removed UID ${target}`);
});
