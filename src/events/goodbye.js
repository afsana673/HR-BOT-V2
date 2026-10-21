'use strict';
module.exports = async function handleGoodbye({threadID, sendText}) {
  await sendText(threadID, '🍘 A member left the group. Goodbye!\n— HR BOT | Developer SK HABIBULLA');
};
