'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {createBot}=require('../src/bot');
function setup() {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hrbot-test-'));
  const sent=[];
  const api={getCurrentUserID:()=> '100',sendMessage:(body,thread,cb)=>{sent.push({body,thread});cb(null,{messageID:'ok'});},getThreadInfo:(id,cb)=>cb(null,{threadName:'Test',participantIDs:['100','200'],adminIDs:[{id:'200'}]})};
  const bot=createBot(api,{admins:['300'],dataDir:tmp});
  return {bot,sent,cleanup:()=>{bot.stop();fs.rmSync(tmp,{recursive:true,force:true});}};
}
test('help ping and group-admin permissions',async()=>{
  const {bot,sent,cleanup}=setup();
  try {
    await bot.handle({type:'message',threadID:'777',senderID:'400',messageID:'1',body:'!ping'});
    assert.match(sent.at(-1).body,/Pong/);
    await bot.handle({type:'message',threadID:'777',senderID:'400',messageID:'2',body:'!welcome off'});
    assert.match(sent.at(-1).body,/Only group administrators/);
    await bot.handle({type:'message',threadID:'777',senderID:'200',messageID:'3',body:'!welcome off'});
    assert.equal(bot.store.getThread('777').welcome,false);
    await bot.handle({type:'message',threadID:'777',senderID:'400',messageID:'4',body:'!help'});
    assert.match(sent.at(-1).body,/HR BOT/);
  }finally{cleanup();}
});
test('bot-admin bans are enforced',async()=>{
  const {bot,sent,cleanup}=setup();
  try {
    await bot.handle({type:'message',threadID:'777',senderID:'300',messageID:'5',body:'!ban 40000'});
    assert.equal(bot.store.isBanned('40000'),true);
    const count=sent.length;
    await bot.handle({type:'message',threadID:'777',senderID:'40000',messageID:'6',body:'!ping'});
    assert.equal(sent.length,count);
  }finally{cleanup();}
});

test('anti-unsend is off by default, then reports recent non-command text after opt-in', async()=>{
  const {bot,sent,cleanup}=setup();
  try {
    await bot.handle({type:'message',threadID:'777',senderID:'400',messageID:'x1',body:'private text'});
    await bot.handle({type:'message_unsend',threadID:'777',senderID:'400',messageID:'x1'});
    assert.equal(sent.length,0);
    await bot.handle({type:'message',threadID:'777',senderID:'200',messageID:'x2',body:'!antiunsend on'});
    await bot.handle({type:'message',threadID:'777',senderID:'400',messageID:'x3',body:'sample text'});
    await bot.handle({type:'message_unsend',threadID:'777',senderID:'400',messageID:'x3'});
    assert.match(sent.at(-1).body,/sample text/);
  } finally {cleanup();}
});

test('prefix show/change is group-scoped and persisted across restart', async()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hrbot-prefix-'));
  const sent=[];
  const api={getCurrentUserID:()=> '100',sendMessage:(body,thread,cb)=>{sent.push({body,thread});cb(null,{messageID:'ok'});},getThreadInfo:(id,cb)=>cb(null,{threadName:'Test',participantIDs:['100','200'],adminIDs:[{id:'200'}]})};
  const bot=createBot(api,{admins:['300'],dataDir:tmp});
  const msg=(thread,sender,body)=>({type:'message',threadID:thread,senderID:sender,messageID:'test',body});
  try {
    await bot.handle(msg('777','400','!prefix'));
    assert.match(sent.at(-1).body,/Current prefix: !/);
    await bot.handle(msg('777','400','!prefix set #'));
    assert.match(sent.at(-1).body,/Only a group admin/);
    await bot.handle(msg('777','200','!prefix set #'));
    assert.equal(bot.store.getPrefix('777','!'),'#');
    await bot.handle(msg('777','400','#ping'));
    assert.match(sent.at(-1).body,/Pong/);
    await bot.handle(msg('777','400','prefix'));
    assert.match(sent.at(-1).body,/Current prefix: #/);
    await bot.handle(msg('888','400','!ping'));
    assert.match(sent.at(-1).body,/Pong/);
    bot.stop();
    const again=createBot(api,{admins:['300'],dataDir:tmp});
    try {
      assert.equal(again.store.getPrefix('777','!'),'#');
      await again.handle(msg('777','200','#prefix reset'));
      assert.equal(again.store.getPrefix('777','!'),'!');
      await again.handle(msg('777','400','!ping'));
      assert.match(sent.at(-1).body,/Pong/);
    } finally { again.stop(); }
  } finally { bot.stop(); fs.rmSync(tmp,{recursive:true,force:true}); }
});
