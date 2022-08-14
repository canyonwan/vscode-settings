import { shallowMount } from '@vue/test-utils'
import Index from 'index.vue'

describe('test vue component', () => {
  test('shallow mount', () => {
    const dom = shallowMount(Index)
    console.log('index dom', dom)
  })
})
