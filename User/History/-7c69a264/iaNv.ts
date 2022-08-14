import {it, expect, test } from 'vitest'
import { add } from './add'

it('true to be true', () => {
  expect(true).toBe(true)
})

test('add toBe 3', () => {
  expect(add(1,2)).toBe(3)
})
