import { expect } from "chai";
import { describe, it } from "vitest";

describe('happy path', () => {
  it('reactive', () =>{
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(1)
  })
})
