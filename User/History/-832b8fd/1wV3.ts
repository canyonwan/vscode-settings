export const UseButton = defineComponent({
  name: 'UseButton',
  props: {
    type: {
      type: String as PropType<'e-button-orange-bg' |'e-button-blue-bg' '>,
      default: 'bg-e-button-blue-bg'
    }
  },
  setup(props, { slots }) {
    return () => {
      if (slots.default) return h('div', { class: [props.type, 'leading-10 px-4 w-24 text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full'] }, slots.default())
    }
  }
})
