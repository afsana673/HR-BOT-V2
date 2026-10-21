'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
module.exports = add => add('admin', 'Display bot admins', 'admin', 'user', async c => c.reply(`🍘 HR BOT Admin UID(s): ${[...c.admins].join(', ') || 'Not configured'}`));
