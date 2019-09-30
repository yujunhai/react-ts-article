import React, { useEffect, useState } from 'react'
import { Input, Icon, Button } from 'antd'
import Tloader from 'react-touch-loader'
import styles from './index.module.less'
import createApi from '@/api/article/index.js'

const { Search } = Input

const Dashboard = (props: any) => {
  const toHref = (val: string) => {
    props.history.push(val)
  }
  // const [state, setState] = useState({ recomandArr: [], listLen: 0, hasMore: 0, initializing: 1, total: 0 })
  const [recomandArr, setrecomandArr] = useState([])
  const [listLen, setlistLen] = useState(0)
  const [hasMore, sethasMore] = useState(false)
  const [initializing, setinitializing] = useState(1)
  const [total, settotal] = useState(0)
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    init()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  const init = () => {
    const obj = {
      limit: 15,
      offset: listLen
    }
    getPublishArticleApi(obj)
  }
  // tslint:disable-next-line: no-empty
  const refresh = () => {}

  const toDetail = (val: any) => {
    props.history.push(val)
  }

  const loadMore = async resolve => {
    console.log(listLen)
    const obj = {
      limit: 15,
      offset: listLen
    }
    // props.getArticleFile(obj).then(res => {
    //   const l = res.data.datas.length
    //   console.log(l)
    //   setState({
    //     ownMenuArr: res.data.datas,
    //     listLen: l,
    //     hasMore: l < res.data.page.total
    //   })
    //   resolve()
    // })
    getPublishArticleApi(obj)
    resolve()
  }

  const getPublishArticleApi = async obj => {
    const res = await createApi.publishArticleQuery(obj)
    console.log(res)
    if (res.status === 200) {
      const l = res.data.datas.length
      setrecomandArr(res.data.datas)
      setlistLen(l)
      sethasMore(l < res.data.page.total)
    }
  }

  const generateRecomand = (menus: any) => {
    let items = []
    items = menus.map(
      (menu: { _id: string | number | undefined; title: React.ReactNode; abstract: React.ReactNode }) => (
        <div
          key={menu._id}
          className={styles.list_item}
          onClick={() => {
            toDetail(menu._id)
          }}
        >
          <p>{menu.title}</p>
          <p>{menu.abstract}</p>
        </div>
      )
    )
    return items
  }

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
              toHref('/article/notebooks')
            }}
          >
            写文章
          </Button>
        </div>
      </div>
      <div className={styles.home_content}>
        <Tloader
          className={styles.tLoader}
          onRefresh={refresh}
          onLoadMore={loadMore}
          autoLoadMore={true}
          hasMore={hasMore}
          initializing={initializing}
        >
          {generateRecomand(recomandArr)}
        </Tloader>
      </div>
    </div>
  )
}
export default Dashboard
