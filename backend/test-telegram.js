const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN || '8958912849:AAE4LQG6QlA3qGQccfIbI8ghZDMgWida-yg';
const CHAT_ID = process.env.TELEGRAM_CHAT || '972326806';

function tg(method, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const opts = {
      hostname: 'api.telegram.org',
      path: '/bot' + BOT_TOKEN + '/' + method,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function test() {
  console.log('[*] Testing Telegram connection...');
  try {
    const r = await tg('getMe', {});
    console.log('[+] Bot: @' + (r.result?.username || 'unknown'));

    const s = await tg('sendMessage', {
      chat_id: CHAT_ID,
      text: '<b>🐱 Ghost Cell Backend ONLINE</b>\n' +
            '🚀 السيرفر شغال وجاهز\n' +
            '📍 في انتظار الضحايا...',
      parse_mode: 'HTML'
    });
    if (s.ok) console.log('[+] Test message sent to chat ' + CHAT_ID);
    else console.log('[!] Error: ' + JSON.stringify(s));
  } catch(e) {
    console.log('[!] Failed: ' + e.message);
  }
}
test();
