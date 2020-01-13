<template>
  <q-page padding class="flex flex-center">
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
		<q-btn @click="leerQR" color="secondary" icon="camera_rear" label="Leer Código QR o de Barras"/>
	</div>
</q-page>
</template>

<style>
</style>

<script>

export default {
  name: 'PageIndex',
  data () {
    return {
	  nombre: '',
      intcodbarra: null,
	  lbBuscando: false,
	  existedisp: null,
	  costo: '',
	  precio: ''
    }
  },

  methods: {

    leerQR () {
      var tipo = typeof cordova
      if (tipo != 'undefined') {
        cordova.plugins.barcodeScanner.scan(
					  (result) => {
            this.intcodbarra = result.text
            setTimeout(() => { this.repetir() }, 0)
            setTimeout(() => { this.haceralgo() }, 500)
					  },
					  function (error) {
						  alert('falló el escaneo: ' + error)
						  intSalir = 1
					  },
					  {
						  preferFrontCamera: false, // iOS and Android
						  showFlipCameraButton: true, // iOS and Android
						  showTorchButton: true, // iOS and Android
						  torchOn: true, // Android, launch with the torch switched on (if available)
						  saveHistory: false, // Android, save scan history (default false)
						  prompt: 'Coloque un código QR dentro del area delimitada', // Android
						  resultDisplayDuration: 100, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
						  orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
						  disableAnimations: true, // iOS
						  disableSuccessBeep: false // iOS and Android
					  }
				   )
      } else {
        setTimeout(() => { this.haceralgo() }, 5)
        setTimeout(() => { this.repetir() }, 0)
      }
    },
    haceralgo () {
      var audio = new Audio('http://soundbible.com/mp3/Boing Cartoonish-SoundBible.com-277290791.mp3')
      audio.play()
    },
    repetir () {
	  setTimeout(() => { this.leerQR() }, 0)
    }
  }
}
</script>
