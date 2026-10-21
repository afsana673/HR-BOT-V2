'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
const {handleWelcome} = require('../events/welcome');
module.exports = add => add('welcome', 'Canvas welcome card for new members', 'welcome on|off|test', 'group-admin', async c => {
  if (!c.isGroup) return c.reply('Group-only command.');
  const mode = c.args[0]?.toLowerCase();
  if (mode === 'on' || mode === 'off') {
    c.store.setThread(c.threadID, {welcome: mode === 'on'});
    return c.reply(`🍘 Canvas welcome: ${mode.toUpperCase()}`);
  }
  if (mode === 'test') {
    await handleWelcome({
      api: c.api, threadID: c.threadID, botUID: c.botUID,
      msg: {logMessageData: {addedParticipants: [{userFbId: c.senderID}]}},
      sendText: (threadID, body) => F.sendText(c.api, threadID, body)
    });
    return;
  }
  return c.reply(`Usage:\n${c.prefix}welcome on\n${c.prefix}welcome off\n${c.prefix}welcome test`);
});
