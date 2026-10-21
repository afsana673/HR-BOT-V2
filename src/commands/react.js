'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const F = require('../lib/fca');
module.exports = add => add('react', 'React to replied message', 'react <emoji>', 'user', async c => {
  if (!c.msg.messageReply?.messageID || !c.args[0]) return c.reply(`Reply to a message: ${c.prefix}react ❤️`);
  await F.react(c.api, c.args[0], c.msg.messageReply.messageID);
});
