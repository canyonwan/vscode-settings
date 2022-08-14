import { shallowMount } from '@vue/test-utils'
import { EButton } from './index'

describe.only('e-button test', () => {
  const wrapper = shallowMount(EButton)
  const classWrapper = wrapper.attributes('class')

  it('mount orange e-button', async () => {
    await wrapper.setProps({
      type: 'orange'
    })
    console.log('orange', classWrapper)
    expect(classWrapper).toContain('bg-e-button-orange-bg')
  })

  it('mount blue e-button', async () => {
    await wrapper.setProps({
      type: 'blue'
    })
    console.log('orange', classWrapper)
    expect(classWrapper).toContain('bg-e-button-blue-bg')
  })
})
