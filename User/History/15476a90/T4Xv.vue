<template>
  <div class="flex justify-center">
    <canvas v-for="pageIndex in pdfPages" :id="`pdf-canvas-` + pageIndex" :key="pageIndex"></canvas>
  </div>
</template>
<script lang="ts">
  import * as pdfJs from 'pdfjs-dist/build/pdf.js'
  export default defineComponent({
    props: {
      url: {
        type: String,
        default: ''
      },
      // 缩放比例
      pdfScale: {
        type: Number,
        default: 1.0
      }
    },
    setup(props) {
      const state = reactive({
        pdfDoc: '' as any, // 保存加载的pdf文件流
        pdfPages: 0 // pdf文件的页数
      })
      const loadFile = (url) => {
        import('pdfjs-dist/build/pdf.worker.entry.js').then((res) => {
          pdfJs.GlobalWorkerOptions.workerSrc = res
          const loadingTask = pdfJs.getDocument(url)
          loadingTask.promise.then((pdf) => {
            state.pdfDoc = pdf
            state.pdfPages = state.pdfDoc.numPages
            nextTick(() => {
              renderPage(1)
            })
          })
        })
      }
      onMounted(() => {
        loadFile(props.url)
      })
      // watch(
      //   () => props.url,
      //   () => {
      //     debugger
      //     loadFile(props.url)
      //   }
      // )
      /*
       * 渲染PDF文件
       * */
      const renderPage = (num) => {
        state.pdfDoc.getPage(num).then((page) => {
          const canvasId = 'pdf-canvas-' + num // 第num个canvas画布的id
          const canvas: any = document.getElementById(canvasId)
          const ctx: any = canvas.getContext('2d')
          const dpr = window.devicePixelRatio || 1
          const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
          const ratio = dpr / bsr
          const viewport = page.getViewport({ scale: props.pdfScale })
          canvas.width = viewport.width * ratio
          canvas.height = viewport.height * ratio
          canvas.style.width = viewport.width + 'px'
          canvas.style.height = viewport.height + 'px'
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext)
          // 在第num页渲染完毕后，递归调用renderPage方法，去渲染下一页，直到所有页面渲染完毕为止
          if (num < state.pdfPages) {
            renderPage(num + 1)
          }
        })
      }
      return {
        ...toRefs(state)
      }
    }
  })
</script>
