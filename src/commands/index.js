'use strict';
// HR BOT 🍘 — Auto-load every independent command file.
// No command implementation belongs in this loader.
const fs = require('node:fs');
const path = require('node:path');
const {getTarget} = require('./_utils');
const {registerPrefixCommand} = require('./prefix');
const commands = new Map();
function add(name, description, syntax, role, handler) {
  if (commands.has(name)) throw new Error(`Duplicate command: ${name}`);
  commands.set(name, {name, description, syntax, role, handler});
}
const files = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && f !== 'index.js' && f !== 'prefix.js' && !f.startsWith('_'))
  .sort((a,b) => a === 'help.js' ? -1 : b === 'help.js' ? 1 : a.localeCompare(b));
for (const file of files) {
  const register = require(path.join(__dirname, file));
  if (typeof register !== 'function') throw new Error(`Command file ${file} must export function(add, commands)`);
  register(add, commands);
}
registerPrefixCommand(add);
module.exports = {commands, getTarget};
