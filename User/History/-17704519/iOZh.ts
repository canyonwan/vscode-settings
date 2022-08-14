import { expect } from "chai";
import { describe, test } from "vitest";
import { effect } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
  test('happy path', () => {
    let user = reactive({
      age: 10
    })

    let nextAge: number | undefined = undefined
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)

  })
})
