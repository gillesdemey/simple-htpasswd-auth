/* eslint-env jest */

'use strict'

const htpasswd = require('../index')
const fs = require('fs')

describe('htpasswd', () => {
  test('returns false with an empty htpasswd', () => {
    const fixture = fs.readFileSync('./test/fixtures/blank', 'utf8')

    return expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(false)
  })

  test('supports plain text', async () => {
    const fixture = fs.readFileSync('./test/fixtures/plain', 'utf8')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', fixture))
      .resolves.toBe(false)
  })

  test('supports md5', async () => {
    const fixture = fs.readFileSync('./test/fixtures/md5', 'utf8')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', fixture))
      .resolves.toBe(false)
  })

  test('supports bcrypt', async () => {
    const fixture = fs.readFileSync('./test/fixtures/bcrypt', 'utf8')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', fixture))
      .resolves.toBe(false)
  })

  test('supports sha1', async () => {
    const fixture = fs.readFileSync('./test/fixtures/sha1', 'utf8')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', fixture))
      .resolves.toBe(false)
  })

  test('supports crypt', async () => {
    const fixture = fs.readFileSync('./test/fixtures/crypt', 'utf8')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', fixture))
      .resolves.toBe(false)
  })

  test('works with a Buffer', () => {
    const fixture = fs.readFileSync('./test/fixtures/sha1')

    return expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .resolves.toBe(true)
  })

  test('works with a ReadableStream', async () => {
    const s1 = fs.createReadStream('./test/fixtures/sha1')

    await expect(htpasswd.authenticate('dickeyxxx', 'pass', s1))
      .resolves.toBe(true)

    const s2 = fs.createReadStream('./test/fixtures/sha1')
    await expect(htpasswd.authenticate('dickeyxxx', 'foo', s2))
      .resolves.toBe(false)
  })

  test('ReadableStream not found', () => {
    const fixture = fs.createReadStream('./test/fixtures/foo')

    return expect(htpasswd.authenticate('dickeyxxx', 'pass', fixture))
      .rejects.toThrowError(/ENOENT/)
  })
})
