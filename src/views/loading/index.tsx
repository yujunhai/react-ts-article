import React, { useEffect } from 'react'
import styles from './index.module.less'

const Loading = () => {
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    // loading.start()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  useEffect(() => {
    console.log('componentDidUpdate： 更新usernmae')
  }, [])

  return (
    <div className={styles.sk_wave}>
      <div className={`${styles.sk_rect} ${styles.sk_rect1}`} />
      <div className={`${styles.sk_rect} ${styles.sk_rect2}`} />
      <div className={`${styles.sk_rect} ${styles.sk_rect3}`} />
      <div className={`${styles.sk_rect} ${styles.sk_rect4}`} />
      <div className={`${styles.sk_rect} ${styles.sk_rect5}`} />
    </div>
  )
}
export default Loading
