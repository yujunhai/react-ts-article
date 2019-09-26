import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import NotMatch from '@/views/notMatch/index.tsx'

export const RouteWithSubRoutes = (route: any) => {
  const isLogin = sessionStorage.getItem('isLogin') && JSON.parse(sessionStorage.getItem('isLogin') || 'false')
  const needAuth = route.auth === false ? false : true
  return needAuth && !isLogin ? (
    <Redirect to={'/login'} />
  ) : (
    <Route
      path={route.path}
      exact={route.exact || false}
      strict={route.strict || false}
      render={(props: any) => <route.component {...props} routes={route.childRoutes} />}
    />
  )
}

// 注意这里加了动画之后，每次切换路由，一开始就会执行组件销毁
const GenerateRoute = (props: any) => {
  return (
    <React.Fragment>
      <TransitionGroup>
        <CSSTransition key={props.location.pathname} classNames="fade" timeout={500}>
          <Switch>
            {props.config.map((route: any, i: number) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
            {<Route component={NotMatch} />}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </React.Fragment>
  )
}

export default withRouter(GenerateRoute)
