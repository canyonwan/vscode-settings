import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DemoVue from './demo.vue'

test('create a div', () => {
  const wrapper = shallowMount(DemoVue)
  expect(wrapper.exists()).toBeTruthy()
})
