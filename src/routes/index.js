import React from 'react'
import Loadable from 'react-loadable'
import { handleRoute } from '@/utils/index.js'
import models from './modules'

const Loading = () => <div>Loading...</div>
const page = name =>
  Loadable({
    loader: () => import(`../views/${name}`),
    loading: Loading
    // delay: 200,
    // timeout: 10000
  })

const Layout = Loadable({
  loader: () => import(`@/components/layout.tsx`),
  loading: Loading
})

const routeConfig = [
  { path: '/', exact: true, strict: true, component: page('Dashboard/index.tsx'), auth: false },
  {
    path: '/admin',
    component: Layout,
    childRoutes: [...models, { path: '/mine', component: page('Mine/index.tsx'), exact: true }]
  },
  {
    path: '/login',
    component: page('login/index.tsx'),
    exact: true,
    auth: false
  }
]

export default handleRoute(routeConfig)
