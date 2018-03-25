'use strict'

const match = require('./match')
const { isReadable } = require('isstream')
const concat = require('concat-stream')
const pAny = require('p-any')

const MD5 = s => s.substr(0, 6) === '$apr1$'
const BCRYPT = s => s.substr(0, 4) === '$2y$'
const SHA1 = s => s.substr(0, 5) === '{SHA}'

async function checkPassword (digest, password) {
  if (MD5(digest)) {
    return match.fromMD5(digest, password)
  } else if (BCRYPT(digest)) {
    return match.fromBcrypt(digest, password)
  } else if (SHA1(digest)) {
    return match.fromSHA1(digest, password)
  } else if (match.fromPlain(digest, password)) {
    return true // plain text
  } else {
    return match.fromCrypt(digest, password)
  }
}

async function authenticate (username, password, htpasswd) {
  if (!htpasswd) return false

  if (isReadable(htpasswd)) {
    return fromStream(htpasswd)
  }

  if (Buffer.isBuffer(htpasswd)) {
    return fromBuffer(htpasswd)
  }

  if (typeof htpasswd === 'string') {
    return fromString(htpasswd)
  }

  function fromStream (readable) {
    return new Promise((resolve, reject) => {
      readable
        .on('error', err => reject(err))
        .pipe(concat(buff => {
          fromBuffer(buff).then(isMatch => resolve(isMatch))
        }))
        .on('error', err => reject(err))
    })
  }

  function fromBuffer (buffer) {
    return fromString(buffer.toString())
  }

  function fromString (string) {
    const lines = string
      .split('\n')
      .filter(Boolean)

    return pAny(lines.map(matchCredentials))
  }

  async function matchCredentials (line = '') {
    const [ user, digest ] = line.split(':')

    return (user === username)
      ? checkPassword(digest, password)
      : false
  }
}

exports.authenticate = authenticate
