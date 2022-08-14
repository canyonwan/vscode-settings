import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DemoVue from './demo.vue'

test.skip('create a div', async () => {
  const wrapper = shallowMount(DemoVue, {
    props: {
      msg: 'msg1',
      show: false
    }
  })
  console.log('wrapper', wrapper.html())
  // const todo = wrapper.get('[data-test="todo"]')
  // await wrapper.setProps({ msg: 'im msg', show: true })

  // const todo = wrapper.get('.demo')

  expect(wrapper.props()).toEqual({
    msg: 'msg1',
    show: false
  })
  expect(wrapper.exists()).toBeTruthy()
  expect(wrapper.emitted()).toHaveProperty('emitHello')
})
