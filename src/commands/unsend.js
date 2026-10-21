'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
module.exports = add => add('unsend', 'Unsend bot message', 'unsend (reply to bot)', 'user', async c => {
  const reply = c.msg.messageReply;
  if (!reply?.messageID || String(reply.senderID) !== c.botUID) return c.reply('Reply to a message sent by HR BOT.');
  await F.unsend(c.api, reply.messageID);
});
