'use strict';

// HR BOT 🍘 — Developer SK HABIBULLA
// Prefix settings are stored separately for each Messenger thread.
const PREFIX_RE = /^[^\p{L}\p{N}\s]{1,5}$/u;

function registerPrefixCommand(add) {
  add('prefix', 'Show or change this chat\'s prefix', 'prefix [set <symbol>|reset]', 'user', async c => {
    const action = (c.args[0] || '').toLowerCase();
    const canEdit = c.isBotAdmin || (c.isGroup && c.isGroupAdmin);

    if (!action || action === 'show') {
      return c.reply(
        `🍘 HR BOT Prefix\nCurrent prefix: ${c.prefix}\n` +
        `Example: ${c.prefix}help\n\n` +
        (canEdit
          ? `Change: ${c.prefix}prefix set #\nReset: ${c.prefix}prefix reset`
          : 'Only a group admin or HR BOT admin can change it.')
      );
    }

    if (action !== 'set' && action !== 'change' && action !== 'reset') {
      return c.reply(`Usage: ${c.prefix}prefix [set <symbol>|reset]`);
    }
    if (!canEdit) return c.reply('🍘 Only a group admin or HR BOT admin can change the prefix.');

    if (action === 'reset') {
      c.store.resetPrefix(c.threadID);
      return c.reply(`✅ Prefix reset to: ${c.defaultPrefix}\nTry ${c.defaultPrefix}help`);
    }

    const next = c.args[1];
    if (!next || !PREFIX_RE.test(next)) {
      return c.reply('🍘 Choose 1–5 non-letter, non-number symbols, without spaces.\nExample: ' + c.prefix + 'prefix set #');
    }
    c.store.setPrefix(c.threadID, next);
    return c.reply(`✅ Prefix changed: ${c.prefix} → ${next}\nNew command: ${next}help\nDeveloper SK HABIBULLA`);
  });
}

module.exports = { registerPrefixCommand };
