<template>
  <q-page padding class="flex flex-center">
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
		<img alt="Santarossa" src="~assets/logo-header_0.png">
		<br><br>
		<q-btn @click="leerQR" color="secondary" icon="camera_rear" label="Leer Código QR o de Barras"/>
		<br><br>
		<q-search clearable class="q-subtitle" @focus="buscarFocusCodigo" autofocus="true" icon="sync" type="number" :decimals="0" color="amber" v-model="intcodbarra" placeholder="Código de producto" />
		<br>
		 <q-btn @click="buscarProducto"  icon="search" color="primary"  label="Buscar"/>
		<br><br>
		<div>
			<q-input @focus="buscarFocusNombre" :loading="lbBuscando" class="q-title" v-model="nombre" type="textarea" placeholder="Descripción del producto" />
		</div>
		<br>
		<div class="row">
		<q-input style="width:85px;font-weight:bold" v-model="existedisp" type="text" readonly inverted-light color="amber" float-label="Stock" />&nbsp;
		<q-input type="number" :decimals="2" prefix="$" style="width:85px;font-weight:bold" v-model="presindes" readonly inverted-light color="white" float-label="s/descto" />&nbsp;
		<q-input type="number" :decimals="2" prefix="$" style="width:85px;font-weight:bold" v-model="precio" readonly inverted-light color="white" float-label="Precio" />
		</div>
	</div>
</q-page>
</template>

<style>
</style>

<script>

import { QSpinnerFacebook } from 'quasar'

export default {
  name: 'PageIndex',
  data () {
    return {
	  nombre:'',
      intcodbarra: null,
	  lbBuscando: false,
	  existedisp: null,
	  presindes: "",
	  precio: ""
    }
  },
  computed: {
    precioVenta: function () {
      return "$"+this.precio}
  },
  methods: {

	show (options) {
      this.$q.loading.show(options)
      setTimeout(() => {
        this.$q.loading.hide()
      }, 15000)
    },
	procesarEntrada(){
	},
	leerQR(){
		this.limpiarValores();
		var tipo = typeof cordova;
		if(tipo!="undefined"){
			cordova.plugins.barcodeScanner.scan(
				  (result)=> {
				    //alert(result.text)
					this.intcodbarra = result.text;
					//alert("OK")
					setTimeout(() => { this.buscarProducto() }, 500);
				  },
				  function (error) {
					  alert("falló el escaneo: " + error);
				  },
				  {
					  preferFrontCamera : false, // iOS and Android
					  showFlipCameraButton : true, // iOS and Android
					  showTorchButton : true, // iOS and Android
					  torchOn: true, // Android, launch with the torch switched on (if available)
					  saveHistory: true, // Android, save scan history (default false)
					  prompt : "Coloque un código QR dentro del area delimitada", // Android
					  resultDisplayDuration: 100, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
					  orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
					  disableAnimations : true, // iOS
					  disableSuccessBeep: false // iOS and Android
				  }
			   );
			} else {
			  this.intcodbarra=354;
			  setTimeout(() => { this.buscarProducto() }, 500);
			}
	},
	limpiarValores(){
	  this.intcodbarra = null;
	  this.nombre      = '';
	  this.existedisp  = null;
	  this.precio      = "";
	  this.presindes       = "";

	},
    buscarFocusCodigo(){
	  this.limpiarValores();
	},
    buscarFocusNombre(){
		this.limpiarValores();
	},
	buscarProducto() {

		this.show({
			spinner: QSpinnerFacebook,
			spinnerColor: 'amber',
			spinnerSize: 100
		  })

		//var url         = 'http://santarossa.ddns.net:1337/consultaStock';
		var url         = 'http://localhost:1337/consultaStock';
		this.lbBuscando = true;
		this.existedisp = null;
		this.precio     = "";
		this.presindes  = "";
		this.$axios.post(url,{intcodbarra: this.intcodbarra,strnombre: this.nombre})
		  .then((response) => {

			this.$q.loading.hide()
			var json        = response.data;
			//alert(JSON.stringify(json));

			if (json.length>1){
				this.$q.localStorage.set("listaProductos", json);
				this.$router.push('/listaProductos');
				}
			else {
				this.nombre     = "("+json[0].numero+") " + json[0].nombre.trim() +" "+ json[0].nomvariedad.trim();
				this.existedisp = json[0].existedisp;
				this.precio     = Math.round(json[0].prevtafd * 100) / 100;
				this.presindes  = Math.round(json[0].presindes * 100) / 100;
				this.lbBuscando = false;
			}
			//setTimeout(() => { this.leerQR() }, 500);
		  })
		  .catch(() => {
			this.lbBuscando = false;
			this.$q.loading.hide();
			this.$q.notify({
			  color: 'negative',
			  position: 'bottom',
			  message: 'No se encontraron datos para esta búsqueda',
			  icon: 'report_problem'
			})
			//setTimeout(() => { this.leerQR() }, 500);
		  })
	  },

    showNotification () {
      this.$q.notify('Error en la conexión')
    }
  }
}
</script>
