import DemoVue from '@/views/program/discretion/demo.vue'
import { shallowMount } from '@vue/test-utils'

test('happy path', () => {
  const wrapper = shallowMount(DemoVue)
  expect(wrapper.exists()).toBeTruthy()
})
