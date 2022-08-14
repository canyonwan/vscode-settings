import { shallowMount, mount } from '@vue/test-utils'
import Index from './index.vue'

describe('test vue component', () => {
  test('shallow mount', () => {
    const dom = mount(Index)
    console.log('index dom', dom)
    expect(dom).toBeDefined()
  })
})
