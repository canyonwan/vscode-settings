import { shallowMount } from '@vue/test-utils'
import { EButton } from './index'
describe.only('e-button test', () => {
  it('mount e-button', () => {
    const wrapper = shallowMount(EButton)
    wrapper.setProps({
      type: 'blue'
    })
    expect(wrapper.vm.type).toBe('blue')
  })
})
