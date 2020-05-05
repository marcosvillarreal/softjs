<template>
  <q-page padding class="row justify-center">    
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">		
			<q-card inline text-color="black" class="q-ma-sm">
			  <q-card-title>
				{{listaProductos[0].nombre}}
				<span slot="subtitle">Código {{listaProductos[0].numero}}</span>
				<q-icon slot="right" color="green" name="check_circle" />
			  </q-card-title>
			  <q-card-main>
				{{listaProductos[0].nomvariedad}} {{listaProductos[0].codbarra13}}
			  </q-card-main>
			  <q-card-separator />
			  <q-card-actions>
				<q-input @click="$router.push('/')"  class="justify-end"  type="number" :decimals="1" prefix="$" style="width:95px;font-weight:bold;align:right;"  v-model="parseFloat(listaProductos[0].prevtaf1).toFixed(1)" readonly inverted-light color="white" float-label="Costo" />
                &nbsp;				
				<q-input @click="$router.push('/')"  class="justify-end"  type="number" :decimals="1" style="width:95px;font-weight:bold;align:right;"  v-model="margen" readonly inverted-light color="white" float-label="Margen" />				
				&nbsp;
				<q-input @click="$router.push('/')" class="justify-end"  type="number" :decimals="1" prefix="$" style="width:95px;font-weight:bold;align:right;"  v-model="parseFloat(precioVenta).toFixed(0)" readonly inverted-light color="amber" float-label="Sugerido" />				
			  </q-card-actions>
			 <q-card-actions vertical>
				<q-btn flat class="bg-red " color="white" @click="$router.push('/')" >Buscar otro precio</q-btn>			
			</q-card-actions>			  
			</q-card>	
	</div>
</q-page>
</template>

<script>
export default {
   name: 'detalleProducto',
  data () {
    return {
	  listaProductos:this.$q.localStorage.get.item("listaProductos"),      
	  margen:this.$q.localStorage.get.item("margen")
    }
  }
  ,  
  computed: {  
    precioVenta: function () {      	
      return this.listaProductos[0].prevtaf1*(1+this.margen/100)}    
  },  
}
</script>

<style>
</style>
