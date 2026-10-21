'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
module.exports = add => add('settings', 'Show group settings', 'settings', 'user', async c => {
  const settings = c.store.getThread(c.threadID);
  return c.reply(`Group settings:\n${Object.entries(settings).map(([key, value]) => `${key}: ${value ? 'ON' : 'OFF'}`).join('\n')}`);
});
