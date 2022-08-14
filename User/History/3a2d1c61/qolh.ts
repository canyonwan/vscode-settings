import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DemoVue from './demo.vue'

test('happy path', () => {
  const wrapper = shallowMount(DemoVue)
  expect(wrapper.exists()).toBeTruthy()
})
