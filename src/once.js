/*
 * once() creates a closure around an async function to
 * ensure it only has one active execution at a time.
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
      queue.push({ resolve, reject })

      // Prevent another asyncFn execution if one is already active.
      if (isActive) {
        return
      }

      isActive = true

      let data
      let success

      try {
        data = await asyncFn(...args)
        success = true
      } catch (err) {
        data = err
        success = false
      }

      queue.forEach(obj => {
        success ? obj.resolve(data) : obj.reject(data)
      })

      isActive = false
      queue = []
    })
  }
}

module.exports = once
