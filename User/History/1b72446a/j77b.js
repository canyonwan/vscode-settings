module.exports = {
  mode: 'jit',
  // darkMode: 'class',
  plugins: [createEnterPlugin()],
  purge: {
    enable: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{vue,ts,tsx}']
  },
  theme: {
    extend: {
      zIndex: {
        '-1': '-1'
      },
      colors: {
        primary: {
          DEFAULT: '#0960bd'
          // dark: primaryColorDark,
        },
        lightPrimary: '#2A5379',
        dartPrimary: '#122440',
        mainHeader: {
          gradientSelectFrom: '#207AC2', // 选中时的渐变起始色
          gradientFrom: '#1D4874', // 未选中时的渐变起始色
          gradientTo: '#041C35',
          normalText: '#5D85B0'
        }
      },
      backgroundImage: {
        'e-button-bg': "url('@/assets/images/common/search-button-bg.png')",
        'e-tools-box-icon': "url('@/assets/icons/tools_box_icon.svg')"
      },
      backgroundSize: {
        full: '100% 100%'
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1600px'
      },
      inset: {
        '1/5': '20%'
      }
    }
  }
}
/**
 * Used for animation when the element is displayed
 * @param maxOutput The larger the maxOutput output, the larger the generated css volume
 */
function createEnterPlugin(maxOutput = 6) {
  const createCss = (index, d = 'x') => {
    const upd = d.toUpperCase()
    return {
      [`*> .enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(50px)`
      },
      [`*> .-enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(-50px)`
      },
      [`* > .enter-${d}:nth-child(${index}),* > .-enter-${d}:nth-child(${index})`]: {
        'z-index': `${10 - index}`,
        opacity: '0',
        animation: `enter-${d}-animation 0.4s ease-in-out 0.3s`,
        'animation-fill-mode': 'forwards',
        'animation-delay': `${(index * 1) / 10}s`
      }
    }
  }
  const handler = ({ addBase }) => {
    const addRawCss = {}
    for (let index = 1; index < maxOutput; index++) {
      Object.assign(addRawCss, {
        ...createCss(index, 'x'),
        ...createCss(index, 'y')
      })
    }
    addBase({
      ...addRawCss,
      [`@keyframes enter-x-animation`]: {
        to: {
          opacity: '1',
          transform: 'translateX(0)'
        }
      },
      [`@keyframes enter-y-animation`]: {
        to: {
          opacity: '1',
          transform: 'translateY(0)'
        }
      }
    })
  }
  return { handler }
}
