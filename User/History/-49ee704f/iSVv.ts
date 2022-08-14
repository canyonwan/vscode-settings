import { addOne } from './foo'

test.skip('两数相加', () => {
  expect(addOne(2, 2)).toBe(4)
})
