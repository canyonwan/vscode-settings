import { addOne } from './foo'
import { test, expect } from 'vitest'

test('两数相加', () => {
  expect(addOne(1, 2)).toBe(3)
})
