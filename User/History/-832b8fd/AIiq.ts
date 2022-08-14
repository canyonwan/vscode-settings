export const UseButton = defineComponent({
  name: 'UseButton',
  props: {},
  setup(_, { slots }) {
    console.log('slots', slots)
    return () => {
      return h('div', { class: 'leading-10 px-4 text-center align-middle text-white cursor-pointer bg-e-button-bg bg-no-repeat bg-full' }, '查询')
    }
  }
})
