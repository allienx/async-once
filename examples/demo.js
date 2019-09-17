const once = require('../src/once.js')

let count = 0

const asyncFn = once(() => {
  count += 1

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })
})

// Multiple calls within 1.5s
asyncFn().then(() => console.log(`First call - ${count}`))
asyncFn().then(() => console.log(`Second call - ${count}`))
asyncFn().then(() => console.log(`Third call - ${count}`))
