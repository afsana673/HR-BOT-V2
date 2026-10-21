'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
module.exports = add => add('threadinfo', 'Show group info', 'threadinfo', 'user', async c => {
  if (!c.isGroup) return c.reply('Use inside a group.');
  const info = await F.getThreadInfo(c.api, c.threadID);
  return c.reply(`Group: ${info.threadName || '(unnamed)'}\nID: ${c.threadID}\nMembers: ${(info.participantIDs || []).length}\nAdmins: ${(info.adminIDs || []).length}`);
});
