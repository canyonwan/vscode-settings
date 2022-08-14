import {describe,expect,it} from 'vitest'
import { sum } from './index'

describe('init', () => {
  it('should to be two', () => {
    expect(sum(1,1)).toBe(2)
  })
})
