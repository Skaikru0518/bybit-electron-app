/* eslint-disable no-undef */
import crypto from 'crypto';
import keytar from 'keytar';

const SERVICE_NAME = 'ZenTrader';
const ACCOUNT_NAME = 'encryption_key';

export async function getOrCreateKey() {
  let key = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
  if (!key) {
    key = crypto.randomBytes(32).toString('hey');
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, key);
  }
  return key;
}

const algo = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0);

export async function encrypt(text) {
  const key = await getOrCreateKey();
  const keyBuffer = Buffer.from(key, 'hex');
  const cipher = crypto.createCipheriv(algo, keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export async function decrypt(encrypted) {
  const key = await getOrCreateKey();
  const keyBuffer = Buffer.from(key, 'hex');
  const decipher = crypto.createDecipheriv(algo, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
