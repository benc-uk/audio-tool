export const AudioView = {
  props: {
    audioData: {
      type: AudioBuffer,
      required: false
    },

    height: {
      type: Number,
      required: false,
      default: 400
    },

    name: {
      type: String,
      required: false
    }
  },

  data: () => {
    return {
      zoom: 100,
      width: 0,
      canvas: null
    }
  },

  mounted() {
    this.canvas = this.$refs.canvas
  },

  watch: {
    audioData() {
      console.log('watcher new', this.audioData)
      this.drawAudio()
    }
  },

  methods: {
    zoomIn() {
      this.zoom += 5
      this.drawAudio()
    },

    zoomOut() {
      this.zoom -= 5
      if (this.zoom < 1) {
        this.zoom = 1
      }
      this.drawAudio()
    },

    zoomWheel(event) {
      if (event.deltaY < 0) {
        this.zoomIn()
      } else {
        this.zoomOut()
      }
    },

    drawAudio() {
      if (!this.audioData) return
      const rawData = this.audioData.getChannelData(0)

      const middle = this.height / 2
      this.canvas.width = rawData.length / (this.zoom * 1)
      this.canvas.height = this.height
      const ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.width, this.height)

      for (let index = 0; index < rawData.length; index += this.zoom) {
        let subSamples = []
        for (let subIndex = 0; subIndex < this.zoom; subIndex++) {
          subSamples[subIndex] = Math.abs(rawData[index + subIndex])
        }
        const sampleValue = Math.max(...subSamples) * middle

        ctx.beginPath()
        ctx.strokeStyle = '#00ffe8'
        ctx.moveTo(index / this.zoom, middle)
        ctx.lineTo(index / this.zoom, middle + sampleValue)
        ctx.moveTo(index / this.zoom, middle)
        ctx.lineTo(index / this.zoom, middle - sampleValue)

        ctx.stroke()
      }
    }
  },

  template: `
  <div v-show="audioData">

    <div id="audio-view"  @wheel.prevent="zoomWheel">
      <canvas ref="canvas" width="0" height="0"></canvas>
    </div>
    <div>
    <button @click="zoomIn" class="button is-link m-2">➕</button>
    <button @click="zoomOut" class="button is-link m-2">➖</button>
    <h2 class="title is-2">Zoom factor: {{ zoom }}</h2>
  </div>
    
  </div>`
}
