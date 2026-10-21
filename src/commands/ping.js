'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
module.exports = add => add('ping', 'Check latency', 'ping', 'user', async c => c.reply(`🍘 Pong! ${Date.now() - c.receivedAt}ms`));
