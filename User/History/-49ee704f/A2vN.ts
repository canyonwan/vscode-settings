import { addOne } from './foo'
import { test } from 'vitest'

test.skip('两数相加', () => {
  expect(addOne(2, 2)).toBe(4)
})
