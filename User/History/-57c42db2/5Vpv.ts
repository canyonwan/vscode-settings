import { shallowMount } from '@vue/test-utils'
import DiscretionIndex from './index.vue'

describe.skip('test vue component', () => {
  test.skip('shallow mount', () => {
    const wrapper = shallowMount(DiscretionIndex)
    expect(wrapper.exists()).toBeTruthy()
  })
})
