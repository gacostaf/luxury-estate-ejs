import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const hash = scryptSync(password, salt, KEY_LENGTH);
  return timingSafeEqual(hash, Buffer.from(key, 'hex'));
}
