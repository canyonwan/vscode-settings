import { shallowMount } from '@vue/test-utils'
import DiscretionIndex from './index.vue'

test('shallow mount', () => {
  const wrapper = shallowMount(DiscretionIndex)
  expect(wrapper.exists()).toBeTruthy()
})
