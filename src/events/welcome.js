'use strict';
// Facebook group subscribe event -> Canvas welcome PNG attachment.
const F = require('../lib/fca');
const {makeWelcomeCard} = require('../lib/welcome-card');
const {getAvatarBuffer} = require('../lib/avatar');

async function handleWelcome({api, msg, threadID, botUID, sendText, renderCard = makeWelcomeCard}) {
  const added = msg.logMessageData?.addedParticipants || [];
  const members = added.filter(user => {
    const uid = String(user.userFbId || user.userID || user.id || '');
    return uid && uid !== botUID;
  });
  if (!members.length) return;

  let groupName = 'OUR GROUP';
  let memberCount;
  try {
    const info = await F.getThreadInfo(api, threadID);
    groupName = info.threadName || groupName;
    memberCount = info.participantIDs?.length;
  } catch (err) { console.warn('[WELCOME] Group details unavailable:', err.message); }

  for (const user of members.slice(0, 10)) {
    const uid = String(user.userFbId || user.userID || user.id);
    let name = user.fullName || user.name || 'New member';
    let avatarBuffer = null;
    try {
      const info = await F.getUserInfo(api, uid);
      const profile = info?.[uid] || info?.[Number(uid)] || info;
      name = user.fullName || profile?.name || name;
      const src = profile?.thumbSrc || profile?.profilePicture || profile?.picture || profile?.avatar;
      if (typeof src === 'string') avatarBuffer = await getAvatarBuffer(src);
    } catch (err) { console.warn('[WELCOME] Avatar unavailable:', err.message); }
    const caption = `🍘 Welcome ${name}!\n🎉 Welcome to ${groupName}!\n— HR BOT | SK HABIBULLA`;
    try {
      const png = await renderCard({name, groupName, memberCount, avatarBuffer});
      await F.sendImage(api, threadID, png, caption);
    } catch (err) {
      console.warn('[WELCOME] Image failed; sending text:', err.message);
      await sendText(threadID, caption);
    }
  }
  if (members.length > 10) await sendText(threadID, `🍘 Welcome to ${groupName}! (${members.length - 10} more new members)`);
}
module.exports = {handleWelcome};
