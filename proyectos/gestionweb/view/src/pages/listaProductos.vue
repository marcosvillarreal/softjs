<template>
  <q-page padding class="row justify-center">
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
			<img alt="Santarossa" src="~assets/logo-header_0.png">
			<q-list>
			<q-list-header inset>PRODUCTOS Y EXISTENCIAS</q-list-header>
				<q-item v-for="(item, index) in listaProductos" :key="index" color="amber" >
					 <q-item-side>
						<!-- <q-btn style="width:70px;" @click="$router.push('/')" color="amber" text-color="black" :label="item.existedisp==0?'0':item.existedisp" /> -->
						<q-input @click="$router.push('/')"  class="justify-end" align="right" type="number" :decimals="0" style="width:60px;" v-model="parseFloat(item.existedisp).toFixed(0)" readonly inverted-light color="amber" float-label="Stock" />
					 </q-item-side>
					 <q-item-main>
						<q-item-tile label>{{item.nombre}}</q-item-tile>
						<q-item-tile sublabel>({{item.numero}}) s/descto ${{Math.round(item.presindes*100)/100}}{{item.nomvariedad}}</q-item-tile>
					  </q-item-main>
					 <q-item-side right>
						<q-input @click="$router.push('/')"  class="justify-end" align="right" type="number" :decimals="1" prefix="$" style="width:75px;font-weight: bold" v-model="parseFloat(item.prevtaf1).toFixed(1)" readonly inverted-light color="white" float-label="Precio" />
					 </q-item-side>
				</q-item>
				  <q-item-separator inset />
			</q-list>
	</div>
</q-page>
</template>

<script>
export default {
  name: 'listaProductos',
  data () {
    return {
	  listaProductos: this.$q.localStorage.get.item('listaProductos')
    }
  }
}
</script>

<style>
</style>
