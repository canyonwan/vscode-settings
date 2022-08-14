export const UseButton = defineComponent({
  name: 'UseButton',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  setup(_, { slots }) {
    return () => {
      if (slots.default) return h('div', { class: ['leading-10 px-4 w-24 text-center align-middle text-white cursor-pointer bg-e-button-bg bg-no-repeat bg-full'] }, slots.default())
    }
  }
})
