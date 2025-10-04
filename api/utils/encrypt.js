/* eslint-disable no-undef */
import crypto from "crypto";
import keytar from "keytar";

const SERVICE_NAME = "ZenTrader";
const ACCOUNT_NAME = "encryption_key";
const algo = "aes-256-cbc";

// Cached encryption key
let cachedKey = null;
let keyInitialized = false;

export async function getOrCreateKey() {
	let key = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
	if (!key) {
		key = crypto.randomBytes(32).toString("hex");
		await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, key);
	}
	return key;
}

// Initialize key cache (call this on app startup)
export async function initializeEncryptionKey() {
	if (!keyInitialized) {
		cachedKey = await getOrCreateKey();
		keyInitialized = true;
	}
	return cachedKey;
}

// Get cached key (sync) - with fallback
function getCachedKey() {
	if (!cachedKey) {
		// Fallback: generate temporary key (not persisted)
		// This prevents app crash but won't persist across restarts
		cachedKey = crypto.randomBytes(32).toString("hex");
	}
	return cachedKey;
}

// ========== ASYNC VERSIONS ==========

export async function encrypt(text) {
	const key = await getOrCreateKey();
	const keyBuffer = Buffer.from(key, "hex");
	const iv = crypto.randomBytes(16); // Random IV for each encryption
	const cipher = crypto.createCipheriv(algo, keyBuffer, iv);
	let encrypted = cipher.update(text, "utf-8", "hex");
	encrypted += cipher.final("hex");
	// Return IV + encrypted data (IV needed for decryption)
	return iv.toString("hex") + ":" + encrypted;
}

export async function decrypt(encrypted) {
	const key = await getOrCreateKey();
	const keyBuffer = Buffer.from(key, "hex");
	// Split IV and encrypted data
	const parts = encrypted.split(":");
	const iv = Buffer.from(parts[0], "hex");
	const encryptedText = parts[1];
	const decipher = crypto.createDecipheriv(algo, keyBuffer, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf-8");
	decrypted += decipher.final("utf-8");
	return decrypted;
}

// ========== SYNC VERSIONS (use cached key) ==========

export function encryptSync(text) {
	const key = getCachedKey();
	const keyBuffer = Buffer.from(key, "hex");
	const iv = crypto.randomBytes(16); // Random IV for each encryption
	const cipher = crypto.createCipheriv(algo, keyBuffer, iv);
	let encrypted = cipher.update(text, "utf-8", "hex");
	encrypted += cipher.final("hex");
	// Return IV + encrypted data (IV needed for decryption)
	return iv.toString("hex") + ":" + encrypted;
}

export function decryptSync(encrypted) {
	const key = getCachedKey();
	const keyBuffer = Buffer.from(key, "hex");
	// Split IV and encrypted data
	const parts = encrypted.split(":");
	const iv = Buffer.from(parts[0], "hex");
	const encryptedText = parts[1];
	const decipher = crypto.createDecipheriv(algo, keyBuffer, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf-8");
	decrypted += decipher.final("utf-8");
	return decrypted;
}
