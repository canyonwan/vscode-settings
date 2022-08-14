import { shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DemoVue from './demo.vue'

test('create a div', async () => {
  const wrapper = shallowMount(DemoVue)
  console.log('wrapper', wrapper.html())
  await wrapper.setProps({ msg: 'im msg', show: true })

  console.log('props', wrapper.props())
  expect(wrapper.exists()).toBeTruthy()
})
