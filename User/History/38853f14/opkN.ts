import { describe, expect, it } from "vitest";
import add from '../index'

describe('test vitest', () => {
  it('init', () => {
    expect(true).toBe(true)
  })
  it('add', () => {
    expect(add(1+3)).toBe(4)
  })
})
