import React from 'react'
import WrappedRoute from './WrapRoute.js'
import { withRouter } from 'react-router-dom'
import Header from '@/components/header.tsx'

interface Props {
  history: any
}
const Layout: React.FC<Props> = props => {
  return (
    <div className="layout_wrap">
      <Header />
    </div>
  )
}
// 需要嵌套路由就使用WrappedRoute 这个高阶组件
export default WrappedRoute(withRouter(Layout))
