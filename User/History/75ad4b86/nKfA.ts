import { describe, expect, it } from 'vitest'

describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            name: 'John',
        })

        expect(user.name).toBe('John')

        effect(() => {
            user.name = 'Jane'
        })

        expect(user.name).toBe('Jane')
    })
})
