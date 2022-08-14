import { shallowMount } from '@vue/test-utils'
import { EButton } from './index'
describe.only('e-button test', () => {
  const wrapper = shallowMount(EButton)
  it('mount orange e-button', async () => {
    await wrapper.setProps({
      type: 'orange'
    })
    const classWrapper = wrapper.attributes('class')
    console.log('orange', classWrapper)
    expect(classWrapper).toContain('bg-e-button-orange-bg')
  })
  it('mount blue e-button', async () => {
    await wrapper.setProps({
      type: 'blue'
    })
    const classWrapper = wrapper.attributes('class')
    expect(classWrapper).toContain('bg-e-button-blue-bg')
  })
})
