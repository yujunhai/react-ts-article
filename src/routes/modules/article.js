import React from 'react'
import Loadable from 'react-loadable'
const Loading = () => <div>Loading...</div>
const page = name =>
  Loadable({
    loader: () => import(`../../views/${name}`),
    loading: Loading
    // delay: 200,
    // timeout: 10000
  })
const config = [
  {
    path: '/article/notebooks',
    component: page('article')
    // childRoutes: [
    //   {
    //     path: '/history',
    //     component: page('News/history.tsx'),
    //     exact: true
    //   },
    //   {
    //     path: '/star/:id',
    //     component: page('News/star.tsx'),
    //     exact: true
    //   }
    // ]
  },
  {
    path: '/article/notebooks/:folder',
    component: page('article')
  },
  {
    path: '/article/notebooks/:folder/:notes',
    component: page('article')
  },
  {
    path: '/article/notebooks/:folder/:notes/:file',
    component: page('article')
  }
]

export default config
