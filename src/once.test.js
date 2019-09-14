const once = require('./once')

jest.useFakeTimers()

describe('once', () => {
  describe('when no argument is provided', () => {
    it('should throw an error', () => {
      expect(() => {
        once()
      }).toThrow()
    })
  })

  describe('when the argument is not a function', () => {
    it('should throw an error', () => {
      const args = [123, 'asdf', [], {}]

      args.forEach(arg => {
        expect(() => {
          once(arg)
        }).toThrow()
      })
    })
  })

  describe('when the wrapped asyncFn is called multiple times', () => {
    const asyncData = [{ a: 1 }, { a: 2 }]
    const err = new Error('It handles reject.')

    let onceFn
    let mockFn

    beforeEach(() => {
      mockFn = jest.fn()

      onceFn = once(() => {
        mockFn()

        return new Promise(resolve => {
          setTimeout(() => {
            resolve(asyncData)
          }, 1000)
        })
      })
    })

    it('should only call the asyncFn once', () => {
      const promise1 = onceFn()
      const promise2 = onceFn()
      const promise3 = onceFn()

      jest.runAllTimers()

      return Promise.all([promise1, promise2, promise3]).then(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
      })
    })

    it('should return a unique promise to each caller', () => {
      const promise1 = onceFn()
      const promise2 = onceFn()
      const promise3 = onceFn()

      expect(promise1 !== promise2).toBe(true)
      expect(promise2 !== promise3).toBe(true)
      expect(promise1 !== promise3).toBe(true)
    })

    describe('when the asyncFn resolves', () => {
      it('should resolve each caller with the asyncData', () => {
        const promise1 = onceFn()
        const promise2 = onceFn()
        const promise3 = onceFn()

        jest.runAllTimers()

        return Promise.all([
          expect(promise1).resolves.toEqual(asyncData),
          expect(promise2).resolves.toEqual(asyncData),
          expect(promise3).resolves.toEqual(asyncData),
        ])
      })

      it('should resolve each caller in the order they were called', () => {
        const testData = []
        const promise1 = onceFn().then(() => testData.push(1))
        const promise2 = onceFn().then(() => testData.push(2))
        const promise3 = onceFn().then(() => testData.push(3))

        jest.runAllTimers()

        return Promise.all([promise1, promise2, promise3]).then(() => {
          expect(testData).toEqual([1, 2, 3])
        })
      })
    })

    describe('when the asyncFn rejects', () => {
      beforeEach(() => {
        onceFn = once(() => {
          mockFn()

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(err)
            }, 1000)
          })
        })
      })

      it('should reject each caller with the error', () => {
        const promise1 = onceFn()
        const promise2 = onceFn()
        const promise3 = onceFn()

        jest.runAllTimers()

        return Promise.all([
          expect(promise1).rejects.toEqual(err),
          expect(promise2).rejects.toEqual(err),
          expect(promise3).rejects.toEqual(err),
        ])
      })

      it('should reject each caller in the order they were called', () => {
        const testData = []
        const promise1 = onceFn().catch(() => testData.push(1))
        const promise2 = onceFn().catch(() => testData.push(2))
        const promise3 = onceFn().catch(() => testData.push(3))

        jest.runAllTimers()

        return Promise.all([promise1, promise2, promise3]).catch(() => {
          expect(testData).toEqual([1, 2, 3])
        })
      })
    })
  })
})
