/*
 * once() creates a closure around an async function to
 * ensure it only has one active async request at a time.
 *
 * Subsequent callers will be returned their own promise.
 * Each promise will be resolved with the async data in
 * the order they were called.
 */
const once = asyncFn => {
  if (typeof asyncFn !== 'function') {
    throw new Error('once() must be called with an async function.')
  }

  let isActive = false
  let queue = []

  return (...args) => {
    return new Promise(async (resolve, reject) => {
      if (isActive) {
        queue.push({ resolve, reject })
        return
      }

      isActive = true

      try {
        const result = await asyncFn(...args)
        resolve(result)

        queue.forEach(fnCall => {
          fnCall.resolve(result)
        })

        isActive = false
      } catch (err) {
        reject(err)

        queue.forEach(fnCall => {
          fnCall.reject(err)
        })

        isActive = false
      }
    })
  }
}

module.exports = once
