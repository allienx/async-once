# async-once

[![CircleCI](https://circleci.com/gh/allienx/async-once.svg?style=svg)](https://circleci.com/gh/allienx/async-once)

Guarantee an async function only has one active execution at a time.

## Usage

```javascript
const once = require('./src/once.js')

let count = 0

const asyncFn = once(() => {
  count += 1

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })
})

// Multiple calls within 1500ms
asyncFn().then(() => console.log(`First call - ${count}`))
asyncFn().then(() => console.log(`Second call - ${count}`))
asyncFn().then(() => console.log(`Third call - ${count}`))

// Promises are resolved in the order they were called.
//
// Output:
// First call - 1
// Second call - 1
// Third call - 1

const resolveWithData = once(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ name: 'demo' })
    }, 1500)
  })
})

resolveWithData().then(data => console.log(`First call - ${data}`))
resolveWithData().then(data => console.log(`Second call - ${data}`))
resolveWithData().then(data => console.log(`Third call - ${data}`))

// Promises are all resolved with the proper data.
//
// Output:
// First call - { name: 'demo' }
// Second call - { name: 'demo' }
// Third call - { name: 'demo' }
```

## Use Case

One possible use case is for refreshing an access token.

- You have multiple network requests that rely on a valid access token.
- The network requests are trigger simultaneously by different parts of the app.
- You only need one refresh token request to be active at a time.

## Tests

*i test sono buoni*

```sh
yarn test
```
