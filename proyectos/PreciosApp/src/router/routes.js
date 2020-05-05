import Default from 'layouts/default'
import listaProductos from 'pages/listaProductos'
import buscaDescripcion from 'pages/buscaDescripcion'
import detalleProducto from 'pages/detalleProducto'
import modificaMargen from 'pages/modificaMargen'
import Index from 'pages/index'

export default [
  {
    path: '/',
    component:Default,
    children: [
      { path: '', component:Index},
	  { path: '/login', component: () => import('pages/Login.vue') },
	  { path: '/profile', component: () => import('pages/profile.vue') },
	  { path: 'listaProductos', component:listaProductos},
	  { path: 'detalleProducto', component:detalleProducto},	  
	  { path: 'modificaMargen', component:modificaMargen},	  	  
	  { path: 'buscaDescripcion', component:buscaDescripcion}
    ]
  },
  
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
