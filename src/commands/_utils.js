'use strict';
const startedAt = Date.now();
function fmtDur(ms) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 86400)}d ${Math.floor(s % 86400 / 3600)}h ${Math.floor(s % 3600 / 60)}m ${s % 60}s`; }
function getTarget(msg, firstArg) {
  if (msg.messageReply?.senderID) return String(msg.messageReply.senderID);
  if (msg.mentions && Object.keys(msg.mentions).length) return Object.keys(msg.mentions)[0];
  if (/^\d{5,25}$/.test(firstArg || '')) return firstArg;
  return null;
}
function addToggle(add, setting, description) {
  add(setting, description, `${setting} on|off`, 'group-admin', async c => {
    if (!c.isGroup) return c.reply('Group-only command.');
    const mode = c.args[0]?.toLowerCase();
    if (!['on', 'off'].includes(mode)) return c.reply(`Usage: ${c.prefix}${setting} on|off`);
    c.store.setThread(c.threadID, { [setting]: mode === 'on' });
    return c.reply(`${setting}: ${mode.toUpperCase()}`);
  });
}
module.exports = {startedAt, fmtDur, getTarget, addToggle};
