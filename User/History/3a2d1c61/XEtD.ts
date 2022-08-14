import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DemoVue from './demo.vue'

test('create a div', async () => {
  const wrapper = shallowMount(DemoVue, {
    props: {
      msg: 'msg1',
      show: false
    }
  })
  console.log('wrapper', wrapper.html())
  // const todo = wrapper.get('[data-test="todo"]')
  await wrapper.setProps({ msg: 'im msg', show: true })

  console.log('props', wrapper.props())
  const todo = wrapper.get('.demo')
  console.log('todo', todo)
  expect(wrapper.exists()).toBeTruthy()
})
