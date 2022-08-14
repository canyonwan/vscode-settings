import { describe, test } from "vitest";

describe('effect', () => {
  test('happy path', () => {
    let user = reactive({
      age: 10
    })

    let nextAge: number
    effect(() => {
      nextAge = user.age + 1
    })


  })
})
