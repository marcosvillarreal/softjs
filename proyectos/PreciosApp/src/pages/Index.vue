<template>
  <q-page padding class="docs-carousel">
    <template>
      <q-card inline class="bigger q-ma-sm">
        <q-card-section>
          <q-carousel
            animated
            v-model="slide"
            arrows
            navigation
            infinite
            autoplay
            transition-prev="slide-right"
            transition-next="slide-left"
            height="260px"
          >
            <q-carousel-slide :name="1" img-src="statics/santarossa1.jpg" />
            <q-carousel-slide :name="2" img-src="statics/santarossa2.jpg" />
            <q-carousel-slide :name="3" img-src="statics/santarossa3.jpg" />
          </q-carousel>
        </q-card-section>
        <q-card-section>
          <q-list highlight link separator bordered padding>
            <q-item clickable @click="leerQR">
              <q-item-section avatar>
                <q-icon color="red" name="linked_camera" size="xl" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">Escanear</q-item-label>
                <q-item-label caption lines="2" class="text-subtitle2"
                  >Buscar precios por código de barras.</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable @click="buscaPorNombre">
              <q-item-section avatar>
                <q-btn unelevated round color="red" icon="search" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">Buscar</q-item-label>
                <q-item-label caption lines="2" class="text-subtitle2"
                  >Buscar productos y precios por descripción.</q-item-label
                >
              </q-item-section>
            </q-item>
			
            <q-item clickable @click="grabarSonido">
              <q-item-section avatar>
                <q-btn unelevated round color="red" icon="search" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">Grabar Voz</q-item-label>
                <q-item-label caption lines="2" class="text-subtitle2"
                  >Grabadora de voz.</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable @click="autenticar">
              <q-item-section avatar>
                <q-btn unelevated round color="red" icon="search" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">Autenticar</q-item-label>
                <q-item-label caption lines="2" class="text-subtitle2"
                  >Autenticar usuario.</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable @click="verperfil">
              <q-item-section avatar>
                <q-btn unelevated round color="red" icon="search" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">Ver perfil</q-item-label>
                <q-item-label caption lines="2" class="text-subtitle2"
                  >Ver el perfil de usuario</q-item-label
                >
              </q-item-section>
            </q-item>
			
          </q-list>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<style></style>

<script>
import { QSpinnerFacebook } from "quasar";

export default {
  name: "PageIndex",
  data() {
    return {
	  conectado: 0,
      nombre: "",
      intcodbarra: null,
      lbBuscando: false,
      existedisp: null,
      costo: "",
      presindes: "",
      margen: "",
      precio: "",
	  usuario: "WEBADM",
	  clave: "M4ADM",
      slide: 1
    };
  },
  created() {
    this.margen = this.$q.localStorage.getItem("margen");
    if (!this.margen > 0) {
      this.$q.localStorage.set("margen", 40);
    }
  },
  mounted() {},

  computed: {
    precioVenta: function() {
      return "$" + this.precio;
    }
  },
  methods: {
     verperfil(){
	  this.$router.push("/profile");
	},
    autenticar(){
	  this.$router.push("/login");
	},
    grabarSonido(){
	  var tipo = typeof cordova;
	  
	  if (tipo != "undefined") {
	  
			var captureSuccess = function(mediaFiles) {
				var i, path, len;
				for (i = 0, len = mediaFiles.length; i < len; i += 1) {
					path = mediaFiles[i].fullPath;
					//alert("success = "+path)
					var audio = new Audio(path);
					audio.play();
				}				
			}

			var captureError = function(error) {
			 navigator.notification.alert('Error : ' + error.code, null, 'Error al grabar el sonido');
			}

		navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:1});	  
	  
	  } else {
		alert("No está corriendo bajo android")
	  }
	},
    show(options) {
      this.$q.loading.show(options);
      setTimeout(() => {
        this.$q.loading.hide();
      }, 15000);
    },
    buscaPorNombre() {
      this.$router.push("/buscaDescripcion");
    },
    cambiarMargen() {
      this.$router.push("/modificaMargen");
    },
    leerQR() {
      this.limpiarValores();
      var tipo = typeof cordova;

      if (tipo != "undefined") {
        var options = {
          types: {
            Code128: true,
            Code39: true,
            Code93: true,
            CodaBar: true,
            DataMatrix: true,
            EAN13: true,
            EAN8: true,
            ITF: true,
            QRCode: true,
            UPCA: true,
            UPCE: true,
            PDF417: true,
            Aztec: true
          },
          detectorSize: {
            width: 1,
            height: 0.7
          }
        };

        window.plugins.GMVBarcodeScanner.scan(
          options,
          (err, result) => {
            if (err) return;
            this.intcodbarra = result;
            setTimeout(() => {
              this.buscarProducto();
            }, 500);
          },
          {}
        );
      } else {
        this.intcodbarra = 7793147000752;
        setTimeout(() => {
          this.buscarProducto();
        }, 500);
      }
    },
    limpiarValores() {
      this.intcodbarra = null;
      this.nombre = "";
      this.existedisp = null;
      this.precio = "";
      this.costo = "";
      this.presindes = "";
    },
    buscarFocusCodigo() {
      this.limpiarValores();
    },
    buscarFocusNombre() {
      this.limpiarValores();
    },
    notificar() {
      this.lbBuscando = false;
      this.$q.loading.hide();
      this.$q.notify({
        color: "negative",
        position: "bottom",
        message: "No se encontraron datos para esta búsqueda",
        icon: "report_problem"
      });
    },	
	  
    buscarProducto() {
      this.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "amber",
        spinnerSize: 100
      });

      var url = "http://santarossa.ddns.net:1337/consultaPrecios";
      this.lbBuscando = true;
      this.existedisp = null;
      this.precio = "";
      this.costo = "";
      this.presindes = "";

      this.$axios
        .post(url, { intcodbarra: this.intcodbarra, strnombre: this.nombre })

        .then(response => {
          this.$q.loading.hide();
          var json = response.data;

          //alert(JSON.stringify(json));

          if (json.length > 1) {
            this.$q.localStorage.set("listaProductos", json);
            this.$router.push("/listaProductos");
          } else {
            if (json.length > 0) {
              this.$q.localStorage.set("listaProductos", json);
              this.$router.push("/detalleProducto");
            } else {
              this.notificar();
            }
          }
        })
        .catch(() => {
          this.notificar();
        });
    },

    showNotification() {
      this.$q.notify("Error en la conexión");
    }
  }
};
</script>
