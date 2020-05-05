<template>
  <q-page padding class="flex flex-top">
    <q-card inline text-color="black" style="width:98%">
      <q-card-section>
        <div class="col">
          <div class="text-h6">
            {{ listaProductos[0].nombre }}
            <q-icon slot="right" color="green" name="check_circle" size="s" />
          </div>
          <div class="text-subtitle2">
            Código {{ listaProductos[0].numero }}
            {{ listaProductos[0].nomvariedad }}
          </div>
        </div>
      </q-card-section>

      <q-card-separator />
      <q-card-actions vertical>
        <template v-if="parseFloat(listaProductos[0].canbase).toFixed(0) > 1">
          <q-input
            outlined
            @click="$router.push('/')"
            class="justify-end text-h6"
            type="number"
            :decimals="1"
            prefix="$"
            style="width:100%;font-weight:bold;align:right;"
            v-model="parseFloat(listaProductos[0].prevtaf1).toFixed(1)"
            readonly
            inverted-light
            color="white"
            label="Precio normal"
          />
          <q-input
            outlined
            color="white"
            bg-color="amber"
            :label="labelOferta"
            @click="$router.push('/')"
            class="justify-end text-h6"
            type="number"
            :decimals="1"
            prefix="$"
            style="width:100%;font-weight:bold;align:right;"
            v-model="parseFloat(listaProductos[0].prevtaporcant).toFixed(1)"
            readonly
          />
        </template>

        <template v-else>
          <q-input
            outlined
            @click="$router.push('/')"
            class="justify-end text-h6"
            type="number"
            :decimals="1"
            prefix="$"
            style="font-weight:bold;align:right;"
            v-model="parseFloat(listaProductos[0].prevtaf1).toFixed(0)"
            readonly
            inverted-light
            color="white"
            label="Precio"
          />
        </template>
      </q-card-actions>
      <q-card-actions vertical>
        <q-btn
          flat
          align="center"
          size="md"
          class="bg-red"
          color="white"
          @click="$router.push('/')"
          >Buscar otro precio</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "detalleProducto",
  data() {
    return {
      listaProductos: this.$q.localStorage.getItem("listaProductos"),
      margen: this.$q.localStorage.getItem("margen")
    };
  },
  computed: {
    precioVenta: function() {
      return this.listaProductos[0].prevtaf1 * (1 + this.margen / 100);
    },
    labelOferta: function() {
      //return "OFERTA! "+this.listaProductos[0].bonificad+"% descuento por "+this.listaProductos[0].canbase+" unidades o más";
      return "Llevando " + this.listaProductos[0].canbase + " o más";
      //return "Por 9 unidades o más";
    }
  }
};
</script>

<style></style>
