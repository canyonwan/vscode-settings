import { shallowMount } from '@vue/test-utils'
import { EButton } from './index'
describe.only('e-button test', () => {
  it('mount e-button', async () => {
    const wrapper = shallowMount(EButton)
    await wrapper.setProps({
      type: 'orange'
    })
    const classWrapper = wrapper.attributes('class')
    console.log('orange', classWrapper)
    expect(classWrapper).toContain('bg-e-button-orange-bg')
    await wrapper.setProps({
      type: 'blue'
    })
    console.log('blue', classWrapper)
    expect(classWrapper).toContain('bg-e-button-blue-bg')
  })
})
