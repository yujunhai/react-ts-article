import React, { useEffect } from 'react'
import { Input, Icon, Button } from 'antd'
import imgSrc from '@/assets/images/logo.jpg'
import styles from './index.module.less'

const { Search } = Input

const Dashboard = (props: any) => {
  const toHref = (val: string) => {
    props.history.push(val)
  }

  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  return (
    <div className={styles.home_wrap}>
      <div className={styles.home_top}>
        <div className={styles.left_top}>
          <span className={styles.r60}>
            <Icon type="home" theme="filled" className={styles.home_icon} />
            首页
          </span>
          <Search placeholder="input search text" onSearch={value => console.log(value)} style={{ width: 200 }} />
        </div>
        <div className={styles.right_top}>
          <span
            className={styles.login_btn}
            onClick={() => {
              toHref('/login')
            }}
          >
            登录
          </span>
          <Button
            className={styles.btn}
            onClick={() => {
              toHref('/register')
            }}
          >
            注册
          </Button>
          <Button
            type="primary"
            icon="edit"
            className={styles.btn}
            onClick={() => {
              toHref('/admin/article')
            }}
          >
            写文章
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
