'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
const {getTarget} = require('./_utils');
module.exports = add => add('uid', 'Your or replied user UID', 'uid', 'user', async c => c.reply(`UID: ${getTarget(c.msg, c.args[0]) || c.senderID}`));
