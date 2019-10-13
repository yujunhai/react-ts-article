import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import NotMatch from '@/views/notMatch/index.tsx'
import { connect } from 'react-redux'

export const RouteWithSubRoutes = (route: any, isLogin: any) => {
  // const isLogin = sessionStorage.getItem('isLogin') && JSON.parse(sessionStorage.getItem('isLogin') || 'false')
  const needAuth = route.auth === false ? false : true
  const needAnimate = route.animate === false ? false : true
  return needAuth && !isLogin ? (
    <TransitionGroup>
      <CSSTransition key="login" classNames="fade" timeout={500}>
        <Redirect to={'/login'} />
      </CSSTransition>
    </TransitionGroup>
  ) : needAnimate ? (
    <TransitionGroup>
      <CSSTransition key={route.pathname} classNames="fade" timeout={500}>
        <Route
          path={route.path}
          exact={route.exact || false}
          strict={route.strict || false}
          render={(props: any) => <route.component {...props} routes={route.childRoutes} />}
        />
      </CSSTransition>
    </TransitionGroup>
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
              <RouteWithSubRoutes key={i} {...route} isLogin={props.isLogin} />
            ))}
            {<Route component={NotMatch} />}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => ({
  isLogin: state.account.isLogin
})

const mapDispatchToProps = (dispatch: any) => ({
  clearFileContent: dispatch.article.clearFileContent
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GenerateRoute)
)
