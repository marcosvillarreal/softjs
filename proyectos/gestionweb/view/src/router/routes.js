import Default from 'layouts/default'
import listaProductos from 'pages/listaProductos'
import listaCarrito from 'pages/listaCarrito'
import listaConsolidado from 'pages/ctacte/listaConsolidado'
import indexPrecio from 'pages/indexPrecio' // 'pages/index'
import index from 'pages/session/login'
import consultaMovCtacte from 'pages/ctacte/consultaMovctacte'
import consultaCtacte from 'pages/ctacte/consultaCtacte'
import resumenCtacte from 'pages/ctacte/resumenCtacte'

export default [
  {
    path: '/',
    component: Default,
    children: [
      { path: '', component: index },
      { path: 'listaProductos', component: listaProductos },
      { path: 'listaCarrito', component: listaCarrito },
      { path: 'listaConsolidado', component: listaConsolidado },
      { path: 'indexPrecio', component: indexPrecio },
      { path: 'consultaMovCtacte', component: consultaMovCtacte },
      { path: 'consultaCtacte', component: consultaCtacte },
      { path: 'resumenCtacte', component: resumenCtacte }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
