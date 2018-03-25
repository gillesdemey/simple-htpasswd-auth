# simple-htpasswd-auth 

[![Build Status](https://travis-ci.org/gillesdemey/simple-htpasswd-auth.svg?branch=master)](https://travis-ci.org/gillesdemey/simple-htpasswd-auth)
[![Coverage Status](https://coveralls.io/repos/github/gillesdemey/simple-htpasswd-auth/badge.svg?branch=master)](https://coveralls.io/github/gillesdemey/simple-htpasswd-auth?branch=master)

read/write htpasswd files

## Setup

```js
npm install --save simple-htpasswd-auth
```

## Checking if a password is valid

```js
const htpasswd = require('htpasswd-auth')
const file = fs.readFileSync('./path-to-htpasswd')

htpasswd.authenticate('username', 'password', file)
  .then(function (auth) {
    // auth is true if the password is valid
  })
```
