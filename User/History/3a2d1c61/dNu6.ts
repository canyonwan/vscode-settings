import { shallowMount } from '@vue/test-utils'

import DemoVue from '@/views/program/discretion/demo.vue'

test('happy path', () => {
  const wrapper = shallowMount(DemoVue)
  expect(wrapper.exists()).toBeTruthy()
})
