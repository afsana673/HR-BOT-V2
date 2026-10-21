'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createBot} = require('../src/bot');
const {commands} = require('../src/commands');
const {safeFacebookUrl} = require('../src/lib/avatar');

const names = ['help','ping','uptime','uid','info','echo','admin','threadinfo','settings',
  'welcome','goodbye','antilink','antiunsend','kick','nickname','react','unsend','ban','unban','prefix'];
test('every command has an individual JavaScript file and registers', () => {
  for (const name of names) {
    assert.equal(fs.existsSync(path.join(__dirname, '../src/commands', `${name}.js`)), true);
    assert.equal(commands.has(name), true);
  }
});

test('welcome card: new member event produces an image attachment', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hr-welcome-test-'));
  const sent = [];
  const api = {
    getCurrentUserID: () => '100',
    getThreadInfo: (id, cb) => cb(null, {threadName:'HR Group',participantIDs:['100','200','300'],adminIDs:[{id:'200'}]}),
    getUserInfo: (id, cb) => cb(null, {[id]: {name:'Ria',thumbSrc:'https://example.org/no-fetch.png'}}),
    sendMessage: (payload, threadID, cb) => { sent.push({payload,threadID}); cb(null, {messageID:'ok'}); }
  };
  let calledWith;
  const bot = createBot(api, {dataDir:dir, admins:['300'], cardRenderer: async info => {
    calledWith = info;
    return Buffer.from('test image');
  }});
  try {
    const event = (uid) => ({type:'event',threadID:'777',logMessageType:'log:subscribe',
      logMessageData:{addedParticipants:[{userFbId:uid,fullName:'Ria'}]}});
    await bot.handle(event('100')); // bot joining should not welcome itself
    assert.equal(sent.length, 0);
    await bot.handle(event('400'));
    assert.equal(sent.length, 1);
    assert.equal(sent[0].threadID, '777');
    assert.ok(sent[0].payload.attachment);
    assert.match(sent[0].payload.body, /Welcome Ria/);
    assert.equal(calledWith.groupName, 'HR Group');
    assert.equal(calledWith.memberCount, 3);
    await bot.handle({type:'message', threadID:'777',senderID:'200',messageID:'a',body:'!welcome off'});
    const before = sent.length;
    await bot.handle(event('400'));
    assert.equal(sent.length, before);
  } finally {bot.stop(); fs.rmSync(dir, {recursive:true, force:true});}
});

test('missing canvas/failed upload gracefully falls back to text', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hr-welcome-test-'));
  const sent = [];
  const api = {
    getCurrentUserID: () => '100',
    getThreadInfo: (id,cb) => cb(null, {threadName:'Test group', participantIDs:[], adminIDs:[]}),
    getUserInfo: (id, cb) => cb(null, {[id]: {name:'Jay'}}),
    sendMessage: (payload, threadID, cb) => {sent.push(payload); cb(null, {});}
  };
  const bot = createBot(api, {dataDir:dir, cardRenderer: async()=>{throw new Error('canvas unavailable');}});
  try {
    await bot.handle({type:'event', threadID:'777',logMessageType:'log:subscribe',logMessageData:{addedParticipants:[{userFbId:'400',fullName:'Jay'}]}});
    assert.equal(sent.length, 1);
    assert.equal(typeof sent[0], 'string');
    assert.match(sent[0], /Welcome Jay/);
  } finally {bot.stop(); fs.rmSync(dir, {recursive:true, force:true});}
});

test('avatar URL helper excludes arbitrary hosts and http', () => {
  assert.equal(safeFacebookUrl('http://graph.facebook.com/a.png'), null);
  assert.equal(safeFacebookUrl('https://example.org/a.png'), null);
  assert.ok(safeFacebookUrl('https://scontent.xx.fbcdn.net/hello.png'));
});
