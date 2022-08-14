import { shallowMount } from '@vue/test-utils'

import DemoVue from '@/views/program/discretion/demo.vue'

test('happy path', () => {
  // const wrapper = shallowMount(DemoVue)
  // expect(wrapper.exists()).toBeTruthy()
  it('creates an instance', function () {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const instance = new Counter({ target: host })
    expect(instance).toBeTruthy()
  })
})
