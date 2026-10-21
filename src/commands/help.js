'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
module.exports = (add, commands) => add('help', 'Show commands', 'help [name]', 'user', async c => {
  const pick = c.args[0]?.toLowerCase();
  if (pick) {
    const item = commands.get(pick);
    return c.reply(item ? `${item.name} — ${item.description}\nUsage: ${c.prefix}${item.syntax}\nRole: ${item.role}` : 'Unknown command.');
  }
  const allowed = [...commands.values()].filter(x => x.role === 'user' || c.isBotAdmin || (c.isGroupAdmin && x.role === 'group-admin'));
  return c.reply(`🍘 HR BOT | Developer SK HABIBULLA\n\n${allowed.map(x => `${c.prefix}${x.syntax} — ${x.description}`).join('\n')}\n\nTotal commands: ${allowed.length}`);
});
