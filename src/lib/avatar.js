'use strict';
// Download only HTTPS Facebook CDN photos. Redirects are rechecked.
function safeFacebookUrl(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    if (u.protocol !== 'https:' || u.port || u.username || u.password) return null;
    if (host === 'facebook.com' || host.endsWith('.facebook.com') ||
        host === 'fbcdn.net' || host.endsWith('.fbcdn.net') ||
        host === 'fbsbx.com' || host.endsWith('.fbsbx.com')) return u.toString();
  } catch {}
  return null;
}
async function getAvatarBuffer(rawUrl) {
  let url = safeFacebookUrl(rawUrl);
  if (!url) return null;
  for (let hop = 0; hop < 3; hop++) {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(5500),
      headers: {Accept: 'image/jpeg,image/png,image/webp,image/*'}
    });
    if ([301,302,303,307,308].includes(response.status)) {
      url = safeFacebookUrl(new URL(response.headers.get('location') || '', url).href);
      if (!url) return null;
      continue;
    }
    if (!response.ok || !String(response.headers.get('content-type') || '').startsWith('image/')) return null;
    const max = 2 * 1024 * 1024;
    if (Number(response.headers.get('content-length')) > max) return null;
    const reader = response.body?.getReader();
    if (!reader) return null;
    const chunks = [];
    let length = 0;
    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > max) { await reader.cancel(); return null; }
        chunks.push(Buffer.from(value));
      }
    } finally { reader.releaseLock(); }
    return Buffer.concat(chunks);
  }
  return null;
}
module.exports = {safeFacebookUrl, getAvatarBuffer};
