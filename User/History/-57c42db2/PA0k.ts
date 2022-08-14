import { shallowMount } from '@vue/test-utils'
import { test } from 'vitest'
import Index from 'index.vue'

test('shallow mount', () => {
  const dom = shallowMount(Index)
  console.log('index dom', dom)
})
