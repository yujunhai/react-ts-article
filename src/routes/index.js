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
    path: '/article/notebooks',
    component: page('article'),
    exact: true
  },
  {
    path: '/article/notebooks/:folder',
    component: page('article'),
    exact: true,
    animate: false
  },
  {
    path: '/article/notebooks/:folder/:notes',
    component: page('article'),
    exact: true,
    animate: false
  },
  {
    path: '/article/notebooks/:folder/:notes/:file',
    component: page('article'),
    exact: true,
    animate: false
  },
  {
    path: '/login',
    component: page('login/index.tsx'),
    exact: true,
    auth: false
  },
  {
    path: '/register',
    component: page('register/index.tsx'),
    exact: true,
    auth: false
  },
  {
    path: '/loading',
    component: page('loading/index.tsx'),
    exact: true,
    auth: false
  }
]

export default handleRoute(routeConfig)
