import { shallowMount } from '@vue/test-utils'
import { EButton } from './index'
describe.only('e-button test', () => {
  it('mount e-button', async () => {
    const wrapper = shallowMount(EButton)
    await wrapper.setProps({
      type: 'blue'
    })
    console.log('class', wrapper.attributes('class'))

    // expect(wrapper.attributes('class'))

    // expect(wrapper.vm.type).toBe('blue')
    // await wrapper.setProps({
    //   type: null
    // })
    // expect(wrapper.vm.type).toBe('orange')
  })
})
