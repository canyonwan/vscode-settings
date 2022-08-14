import { shallowMount, mount } from '@vue/test-utils'
import DiscretionIndex from './index.vue'

describe('test vue component', () => {
  test('shallow mount', () => {
    const wrapper = shallowMount(DiscretionIndex)
    // console.log('index dom', dom)
    expect(dom).toBeDefined()
  })
})
