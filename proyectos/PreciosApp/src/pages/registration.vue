<template>
  <q-page padding class="flex flex-top">      	

<div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">Company &amp; Co</h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
              <q-btn fab icon="add" color="purple-4" />
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl">
              <q-input square clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input square clearable v-model="password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pa-md q-gutter-md">
              <q-btn round color="indigo-7">
                <q-icon name="fab fa-facebook-f" size="1.2rem" />
              </q-btn>
              <q-btn round color="red-8">
                <q-icon name="fab fa-google-plus-g" size="1.2rem" />
              </q-btn>
              <q-btn round color="light-blue-5">
                <q-icon name="fab fa-twitter" size="1.2rem" />
              </q-btn>
            </div>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="purple-4" class="full-width text-white" label="Sign In" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6">Forgot your password?</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">Registration</h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
              <q-btn fab icon="close" color="purple-4" />
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl q-pb-lg">
              <q-input square clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input square clearable v-model="username" type="username" label="Username">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input square clearable v-model="password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="purple-4" class="full-width text-white" label="Get Started" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6">Return to login</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  
		<q-card inline text-color="black" style="width:98%">
		 <q-card-section>
		 
                <div class="form">                  
                  <q-field
                    :value="login.username"
                    color="grey-3"
                    label-color="primary"
                    label="Usuario"
                    bottom-slots
                    stack-label
                    counter
                    clearable
                    maxlength="15"
                  >
                    <template v-slot:prepend>
                      <q-icon name="perm_identity" color="lime-9" />
                    </template>
                    <template v-slot:control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        <q-input v-model="login.username" autofocus></q-input>
                      </div>
                    </template>
                  </q-field>

                  <q-field
                    :value="login.password"
                    :count="15"
                    color="grey-3"
                    label-color="secondary"
                    label="Contraseña"
                    bottom-slots
                    stack-label
                    counter
                    clearable
                    maxlength="15"
                  >
                    <template v-slot:prepend>
                      <q-icon name="https" color="lime-9" />
                    </template>
                    <template v-slot:control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="1"
                      >
                        <q-input
                          v-model="login.password"
                          type="password"
                          name="password"
                        ></q-input>
                      </div>
                    </template>
                  </q-field>
                </div>
		
		
        </q-card-section>
		
			 <q-card-actions>			 
				<div class="row full-width">
				  <q-btn  no-caps push class="bg-positive full-width"  text-color="white" label="Ingresar"
				  size="md" @click="auth('')" >
				  </q-btn>			 
				</div>
			  </q-card-actions>

			 <q-card-actions>			 
				<div class="row full-width">
				  <q-btn  no-caps push class="fb full-width"  icon="fab fa-facebook" label="Ingresar con Facebook"
				  size="md" @click="auth('facebook')" >
				  </q-btn>			 
				</div>
			  </q-card-actions>
			  
			 <q-card-actions>
				<div class="row full-width">
				  <q-btn  no-caps class="google full-width" push
				  icon="fab fa-google" label="Ingresar con Google+"
				  size="md" @click="auth('google')" >
				  </q-btn>			 
				</div>
			  </q-card-actions>
			 <q-card-actions>
				<div class="row full-width">
				  <q-btn  no-caps class="twitter full-width" push 
				  icon="fab fa-twitter" label="Ingresar con Twitter"
				  size="md" @click="auth('twitter')" >
				  </q-btn>			 
				</div>
			  </q-card-actions>
		</q-card>			
    </q-page>
</template>

<style>
/* style inputs and link buttons */
input,
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  margin: 5px 0;
  opacity: 0.85;
  display: inline-block;
  font-size: 17px;
  line-height: 20px;
  text-decoration: none; /* remove underline from anchors */
}
/* style the submit button */
input[type=submit] {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}
/* add appropriate colors to fb, twitter and google buttons */
.fb {
  background-color: #3B5998;
  color: white;
}

.twitter {
  background-color: #55ACEE;
  color: white;
}

.google {
  background-color: #dd4b39;
  color: white;
}

</style>

<script>

export default {
  name: 'Login',
	data() {
    return {
      conectado: 0,
      slide: 1,
      conectado: 0,
      respuesta: "",
      urlLogin:
        "http://172.18.4.72:70/sse_generico/espanol/generico_login_M4ADM.jsp",
      login: {
        email: "",
        password: "",
        username: ""
      }
    };
  },  
  methods: {	
  notificar(texto) {
      this.lbBuscando = false;
      this.$q.loading.hide();
      this.$q.notify({
        color: "negative",
        position: "bottom",
        message: texto,
        icon: "report_problem"
      });
    },	  
    auth (network) {
	
	  var tipo   = typeof cordova;	  
	  alert(tipo)
	  var strUri = ''
	  if (tipo != "undefined") {
		 strUri = 'https://adodson.com/hello.js/redirect.html'
	  }

	
	  this.$q.localStorage.set("redsocial", network);
	  
	  if(network=='facebook'){
		this.$hello(network).login({ scope: 'email' })
			.then(() => {
				this.$router.push('profile')
			})
	  }	
	  
	  if(network=='google'){
		   //	strUri =  'http://localhost/login'
			this.$hello(network).login({display:'popup',force:false,response_type: 'token id_token', scope: 'email',redirect_uri:strUri})
				.then(() => {						   				   
				   this.$router.push('profile')
				}, (e)=> {
					alert('Signin error: ' + e.error.message);
					}
				)
										
			
	  }	
		
    }
  }
}
</script>

