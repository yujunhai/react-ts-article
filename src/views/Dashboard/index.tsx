import React, { useEffect } from 'react'
import { Button } from 'antd'
import imgSrc from '@/assets/images/logo.jpg'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styles from './index.module.less'

const Dashboard = (props: any) => {
  const canvasRef = React.createRef() as any
  const toAdmin = () => {
    props.history.push('/admin')
  }

  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
      // console.log(canvasRef.current.parentNode.removeChild(canvasRef.current))
    }
  }, [])

  return (
    <div className={styles.home_wrap}>
      <canvas className={styles.canvas} id="c_n1" ref={canvasRef} />
      <div>
        <TransitionGroup>
          <CSSTransition appear={true} classNames="appAppear" timeout={500}>
            <img src={imgSrc} alt="logo" className={styles.home_logo} />
          </CSSTransition>
        </TransitionGroup>
      </div>
      <div style={{ margin: '20px 0' }}>
        <h1>Catherine 文章发布管理</h1>
      </div>
      <div>
        <Button
          className={styles.btn_block}
          onClick={() => {
            toAdmin()
          }}
        >
          进入系统...
        </Button>
      </div>
    </div>
  )
}
export default Dashboard
