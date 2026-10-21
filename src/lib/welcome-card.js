'use strict';
// HR BOT 🍘 — Developer SK HABIBULLA
// Generate a premium 1200x600 PNG with node-canvas.

function cleanText(value, max = 50) {
  const text = String(value ?? '').replace(/[\r\n\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
function clipText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  while (text.length && ctx.measureText(text + '…').width > maxWidth) text = text.slice(0, -1);
  return text + '…';
}
function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function makeWelcomeCard({name, groupName, memberCount, avatarBuffer} = {}, canvasModule) {
  const {createCanvas, loadImage} = canvasModule || require('canvas');
  const canvas = createCanvas(1200, 600);
  const c = canvas.getContext('2d');
  const userName = cleanText(name || 'New member', 70);
  const group = cleanText(groupName || 'OUR GROUP', 70);

  // Background: midnight-blue gradient + glowing orbs
  const background = c.createLinearGradient(0, 0, 1200, 600);
  background.addColorStop(0, '#111a39');
  background.addColorStop(0.52, '#27204b');
  background.addColorStop(1, '#0b2037');
  c.fillStyle = background;
  c.fillRect(0, 0, 1200, 600);
  for (const [x, y, size, color] of [
    [1050, 50, 340, 'rgba(145, 93, 255, 0.30)'],
    [120, 530, 280, 'rgba(0, 217, 216, 0.20)'],
    [740, 590, 210, 'rgba(255, 182, 82, 0.11)']
  ]) {
    const glow = c.createRadialGradient(x, y, 0, x, y, size);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = glow;
    c.fillRect(x - size, y - size, size * 2, size * 2);
  }
  // Rounded glass panel and thin glowing outline
  roundRect(c, 34, 36, 1132, 528, 30);
  c.fillStyle = 'rgba(255, 255, 255, 0.055)';
  c.fill();
  c.lineWidth = 2;
  c.strokeStyle = 'rgba(255, 255, 255, 0.17)';
  c.stroke();
  c.fillStyle = '#ffcd7c';
  c.fillRect(75, 80, 8, 60);

  // Brand wordmark
  c.textAlign = 'left';
  c.fillStyle = '#f7f5ff';
  c.font = 'bold 32px sans-serif';
  c.fillText('HR BOT', 102, 121);
  c.fillStyle = '#fbbd75';
  c.font = 'bold 18px sans-serif';
  c.fillText('WELCOME  •  NEW MEMBER', 102, 169);

  // Avatar ring and image, with graceful fallback to initial
  const ax = 264, ay = 353, ar = 139;
  c.beginPath();
  c.arc(ax, ay, ar + 12, 0, Math.PI * 2);
  c.strokeStyle = '#ffcf86';
  c.lineWidth = 7;
  c.stroke();
  c.beginPath();
  c.arc(ax, ay, ar + 3, 0, Math.PI * 2);
  c.fillStyle = '#263f60';
  c.fill();
  let displayedPhoto = false;
  if (avatarBuffer && avatarBuffer.length) {
    try {
      const img = await loadImage(avatarBuffer);
      c.save();
      c.beginPath();
      c.arc(ax, ay, ar, 0, Math.PI * 2);
      c.clip();
      const ratio = Math.max(2 * ar / img.width, 2 * ar / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      c.drawImage(img, ax - w / 2, ay - h / 2, w, h);
      c.restore();
      displayedPhoto = true;
    } catch (err) { console.warn('[WELCOME CARD] Avatar decode failed:', err.message); }
  }
  if (!displayedPhoto) {
    c.font = 'bold 150px sans-serif';
    c.textAlign = 'center';
    c.fillStyle = '#ffffff';
    c.fillText(Array.from(userName)[0]?.toUpperCase() || 'H', ax, ay + 54);
  }

  c.textAlign = 'left';
  c.fillStyle = '#ffffff';
  c.font = 'bold 54px sans-serif';
  c.fillText('WELCOME!', 490, 295);
  c.fillStyle = '#ffdb9f';
  c.font = 'bold 44px sans-serif';
  c.fillText(clipText(c, userName, 625), 490, 363);
  c.fillStyle = '#cdd9ef';
  c.font = '25px sans-serif';
  c.fillText('We are happy to have you here', 492, 414);

  c.font = 'bold 27px sans-serif';
  c.fillStyle = '#ffffff';
  c.fillText(clipText(c, group, 630), 492, 466);
  if (Number.isFinite(memberCount) && memberCount >= 1) {
    c.fillStyle = '#aeb9df';
    c.font = '21px sans-serif';
    c.fillText(`MEMBER #${Math.floor(memberCount)}`, 493, 505);
  }
  c.textAlign = 'right';
  c.font = '19px sans-serif';
  c.fillStyle = '#b8aacd';
  c.fillText('Developer SK HABIBULLA', 1122, 545);
  return canvas.toBuffer('image/png');
}
module.exports = {makeWelcomeCard, cleanText};
