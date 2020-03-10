<template>
  <q-page padding class="flex flex-center">
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">

		<br><br>
		<q-search clearable class="q-subtitle" @focus="buscarFocusCodigo" autofocus="true" icon="sync" type="number" :decimals="0" color="amber" v-model="codCtacte" placeholder="Código de Cliente" />
		<br>
		 <q-btn @click="buscarCtacte"  icon="search" color="primary"  label="Buscar"/>

		<br><br>
		<div>
			<q-input @focus="buscarFocusNombre" :loading="lbBuscando" class="q-title" v-model="nombre" readonly  placeholder="Nombre del Cliente" />
      <br>
      <q-input @focus="buscarFocusNombre" :loading="lbBuscando" class="q-title" v-model="direccion" readonly  placeholder="Dirección" />
		</div>
    <div  v-show="hayCliente">
      <br>
      <q-btn @click="verConsolidado"  icon="list" color="pink-3"  label="Consolidado" />
      <br><br>
      <q-datetime v-model="fecDesde" type="date" color='red-3' :first-day-of-week="1" stack-label="Fecha desde"  />
      <q-btn @click="verResumen"  icon="list" color="red-3"  label="Resumen" />
      <br><br>
    </div>
	</div>
</q-page>
</template>

<style>
</style>

<script>

import { QSpinnerFacebook } from 'quasar'
import { date } from 'quasar'


export default {
  name: 'PageIndex',
  data () {
    return {
      nombre: '',
      direccion: '',
      codCtacte: null,
      lbBuscando: false,
      hayCliente:false,
      fecDesde: date.formatDate(date.subtractFromDate(Date(), {month: 1 }), 'YYYY-MM-DD', {
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes' /* and all the rest of days - remember starting with Sunday */],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre','Noviembre','Diciembre' /* and all the rest of months */]
      })

	  }
  },

  methods: {

	  show (options) {
      this.$q.loading.show(options)
      setTimeout(() => {
        this.$q.loading.hide()
      }, 15000)
    },

	  procesarEntrada () {
	  },

	  limpiarValores () {
	    this.codCtacte = null
	    this.nombre = ''
	    this.direccion = ''
    },

    buscarFocusCodigo () {
	    this.limpiarValores()
    },

    buscarFocusNombre () {
		  this.limpiarValores()
    },

    buscarCtacte () {
      this.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 100
      })

      //var url = 'http://localhost:1337/consultaMovCtacte'
      //var url = 'http://gestionweb-test.ddns.net:1337/consultaMovCtacte'
	  var url = 'http://distribuidorakleja.ddns.net:3000/consultaMovCtacte'
	  //var url = 'http://190.92.109.239:1337/'
	  
      this.lbBuscando = true
      this.hayCliente = false
      var modulo      = "Cons_Ctacte";
      //alert(modulo)

		  this.$axios.post(url, { codctacte: this.codCtacte, strmodulo: modulo })
		    .then((response) => {
			    this.$q.loading.hide()
          var json = response.data

		  	  // alert(JSON.stringify(json));

          this.$q.localStorage.set('buscoCtacte', json)
          this.nombre = '(' + json[0].codigo + ') ' + json[0].nombre.trim()
          this.direccion = json[0].direccion.trim()
          this.lbBuscando = false
          this.hayCliente = true
		    })
		    .catch(() => {
          this.lbBuscando = false
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'No se encontraron datos para esta búsqueda',
            icon: 'report_problem'
          })
          // setTimeout(() => { this.leerQR() }, 500);
          // document.getElementById("btn_consolidado").focus;
        })
	  },

    showNotification () {
      this.$q.notify('Error en la conexión')
    },

    verConsolidado () {

      this.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 100
      })

      this.$q.localStorage.remove('movCtacte')

      //var url = 'http://localhost:1337/consultaMovCtacte'
      var url = 'http://gestionweb-test.ddns.net:1337/consultaMovCtacte'
	  //var url = 'http://distribuidorakleja.ddns.net:1337/consultaMovCtacte'
      this.lbBuscando = true

      // alert("VerConsolidado");

      this.$axios.post(url, { codctacte: this.codCtacte, strmodulo: 'Mov_SinRango' })
		    .then((response) => {
			    this.$q.loading.hide()
          var json = response.data

		  	  //alert(JSON.stringify(json))

          this.$q.localStorage.set('movCtacte', json)
          this.lbBuscando = false

          this.$router.push('/listaConsolidado')
		    })
		    .catch(() => {
          this.lbBuscando = false
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'No se encontraron datos para esta búsqueda',
            icon: 'report_problem'
          })
          // setTimeout(() => { this.leerQR() }, 500);
          // document.getElementById("btn_consolidado").focus;
        })
    },
    verResumen () {

      this.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 100
      })

      this.$q.localStorage.remove('movCtacte')

      //var url = 'http://localhost:1337/consultaMovCtacte'
      var url = 'http://gestionweb-test.ddns.net:1337/consultaMovCtacte'
	  //var url = 'http://distribuidorakleja.ddns.net:1337/consultaMovCtacte'
      this.lbBuscando = true
      //this.fecDesde = '20190306'

      var cFecDesde = date.formatDate(this.fecDesde,'YYYYMMDD')

      // alert("VerConsolidado");

      this.$axios.post(url, { codctacte: this.codCtacte, strmodulo: 'Mov_SinRango', fecha: cFecDesde })
		    .then((response) => {
			    this.$q.loading.hide()
          var json = response.data

		  	  //alert(JSON.stringify(json))

          this.$q.localStorage.set('movCtacte', json)
          this.lbBuscando = false

          this.$router.push('/resumenCtacte')
		    })
		    .catch(() => {
          this.lbBuscando = false
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'No se encontraron datos para esta búsqueda',
            icon: 'report_problem'
          })
          // setTimeout(() => { this.leerQR() }, 500);
          // document.getElementById("btn_consolidado").focus;
        })
	  }
  }
}
</script>
