import { describe, expect, it } from "vitest";

describe('test vitest', () => {
  it('init', () => {
    expect(true).toBe(true)
  })
  it('add', () => {
    expect(add(1+3)).toBe(4)
  })
})
