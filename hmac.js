const crypto = require('crypto');

const blockSizes = {
  'md4': 512,
  'md5': 512,
  'sha1': 512,
  'sha224': 512,
  'sha256': 512,
  'sha512': 1024
}

function HMAC(algorithm, key, message, blockSize = blockSizes[algorithm]) { // HMAC-SHA256
  key = new TextEncoder().encode(key);
  message = new TextEncoder().encode(message);

  if (typeof blockSize === 'undefined') throw new Error('pass block size of algorithm');

  const hash = createFunc(algorithm);

  // normalize key
  const length = key.length * 8;
  if (length > blockSize) key = hash(key);
  if (length < blockSize) key = padEnd(key, blockSize / 8);

  return hash(concat(xorEach(key, 0x5c), hash(concat(xorEach(key, 0x36), message))));
}

function padEnd(buffer, length, fill = 0x00) {
  return Buffer.concat([ buffer, Buffer.alloc(length - buffer.length, fill) ]);
}

function xorEach(buffer, byte) {
  return buffer.map((value) => value ^ byte);
}

function concat(...buffers) {
  return Buffer.concat(buffers);
}

function createFunc(algorithm) {
  const hash = crypto.createHash(algorithm);
  return (data) => hash.copy().update(data).digest();
}

const algorithm = 'sha256';
const key = 'my secret key';
const message = 'Hello World!';

console.log(HMAC(algorithm, key, message).toString('hex'));

console.log(crypto.createHmac(algorithm, key).update(message).digest('hex'));
