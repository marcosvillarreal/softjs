import Default from 'layouts/default'
import index from 'pages/session/login'
import menu from 'pages/menu/menu'
import nuevaTienda from 'pages/tienda/nuevaTienda'
import nuevoPedido from 'pages/tienda/nuevoPedido'

export default [
  {
    path: '/',
    component: Default,
    children: [
      { path: '', component: index },
      { path: 'menu', component: menu },
	  { path: 'nuevaTienda', component: nuevaTienda },
	  { path: 'nuevoPedido', component: nuevoPedido }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
