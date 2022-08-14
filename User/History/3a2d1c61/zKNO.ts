// import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
// import DemoVue from './demo.vue'

test('create a div', () => {
  // const wrapper = shallowMount(DemoVue)
  // expect(wrapper.exists()).toBeTruthy()
  const div = document.createElement('div')
  document.body.appendChild(div)
  console.log(document.body)
  expect(document.body.children.length).toBe(1)
})
