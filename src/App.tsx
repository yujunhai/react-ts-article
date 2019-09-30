import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import GenerateRoute from '@/components/generateRoute.tsx'
import routeConfig from '@/routes/index.js'
import { Provider } from 'react-redux'
import store from '@/store/index.js'

export default class App extends React.Component {
  public componentDidMount() {
    window.onbeforeunload = () => {
      sessionStorage.setItem('store', JSON.stringify(store.getState()))
    }
  }
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <GenerateRoute config={routeConfig} />
        </Router>
      </Provider>
    )
  }
}
