// import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
// import DemoVue from './demo.vue'

// test('create a div', () => {
//   // const wrapper = shallowMount(DemoVue)
//   // expect(wrapper.exists()).toBeTruthy()
//   const div = document.createElement('div')
//   document.body.appendChild(div)
//   console.log(document.body.children)
//   expect(document.body.children.length).toBe(1)
// })

import { shallowMount } from '@vue/test-utils'

// The component to test
const MessageComponent = {
  template: '<p>{{ msg }}</p>',
  props: ['msg']
}

test('displays message', () => {
  const wrapper = shallowMount(MessageComponent, {
    props: {
      msg: 'Hello world'
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world')
})
