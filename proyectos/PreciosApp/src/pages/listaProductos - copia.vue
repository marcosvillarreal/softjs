<template>
  <q-page padding>    
	<!-- <div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">		-->
	<div style="width:100%;">
			<!--<q-btn @click="$router.push('/')" align="center" size="md" class="bg-red" color="white">Productos coincidentes</q-btn>-->			
			<q-list no-border style="max-width: 600px">
				<q-item v-for="(item, index) in listaProductos" :key="index" style="width:100%;">
					<q-item-section>
					  <q-item-label class="text-subtitle2" lines="5">{{item.nombre}}</q-item-label>
					  <q-item-label caption lines="2">{{item.codbarra13}} {{item.nomvariedad}}</q-item-label>
					</q-item-section>		
					<q-item-section side >
					  <q-input outlined @click="$router.push('/')"  class="justify-end text-subtitle1"  type="number" :decimals="1" prefix="$" style="width:95px;font-weight:bold;align:right;"  v-model="parseFloat(item.prevtaf1).toFixed(1)" readonly color="white" label="Precio" />															    		  
					</q-item-section>
					<q-item-section  v-if="item.canbase>1">
						<q-input outlined color="white" bg-color="amber"  @click="$router.push('/')"  class="justify-end text-subtitle1"  type="number" :decimals="1" prefix="$" style="width:95px;font-weight:bold;align:right;"  v-model="parseFloat(item.prevtaporcant).toFixed(1)" readonly   :label="'x '+parseFloat(item.canbase).toFixed(0)" />															
					</q-item-section>
					<q-item-section v-if="item.canbase<1">
						<div>&nbsp;</div>
					</q-item-section>
					
		  </q-item>
		  <q-item-separator inset />
		</q-list>			
	</div>
	<q-page-sticky position="bottom-right">
    <q-btn round color="red" @click="$router.push('/')" icon="skip_previous" />
   </q-page-sticky>

</q-page>
</template>

<script>
export default {
   name: 'listaProductos',
  data () {
    return {
	  listaProductos:this.$q.localStorage.getItem("listaProductos"),
	  margen:this.$q.localStorage.getItem("margen")      
    }
  }  ,  
  computed: {  
    precioVenta: function () {      	
      return this.listaProductos[0].prevtaf1*(1+this.margen/100)}    
	  ,
    labelOferta: function() {   
      var strRet = ""
	  if (parseFloat(this.listaProductos[0].canbase).toFixed(0)>1){
	  	  return "x "+this.listaProductos[0].canbase+" o más";    
	  } else {
	  	  return "";    
	  }
	  //return "Por 9 unidades o más";    	   
  },  
 }
}
</script>

<style>
</style>
