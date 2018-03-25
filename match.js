const md5 = require('apache-md5')
const crypt = require('apache-crypt')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { promisify } = require('util')

function fromMD5 (digest, password) {
  return digest === md5(password, digest)
}

function fromBcrypt (digest, password) {
  digest = '$2a$' + digest.substr(4)
  return promisify(bcrypt.compare)(password, digest)
}

function fromSHA1 (digest, password) {
  return '{SHA}' + sha1(password) === digest
}

function fromCrypt (digest, password) {
  return crypt(password, digest) === digest
}

function fromPlain (digest, password) {
  return digest === password
}

function sha1 (password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

module.exports = {
  fromMD5,
  fromSHA1,
  fromBcrypt,
  fromCrypt,
  fromPlain
}
