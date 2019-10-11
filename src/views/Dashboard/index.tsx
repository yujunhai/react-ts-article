import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Tloader from 'react-touch-loader'
import styles from './index.module.less'
import constant from '@/utils/constant.js'
import { Carousel } from 'antd'
import Header from '@/components/header.tsx'

const Dashboard = (props: any) => {
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    const init = () => {
      if (!props.publishedFile.init) {
        props.getPublishedFile()
      }
    }
    init()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  const carousels = [1, 2, 3, 4]

  const toDetail = (val: any) => {
    window.open(window.origin + `/#/art/articleContent/${val}`)
    // props.history.push(`/art/articleContent/${val}`)
  }

  const loadMore = () => {
    const obj = {
      limit: constant.LIMIT,
      offset: props.publishedFile.data.page.offset + props.publishedFile.data.datas.length,
      add: 'add'
    }
    props.getPublishedFile(obj)
  }

  const generateRecomand = (menus: any) => {
    let items = []
    items = menus.map(
      (menu: {
        _id: string | number | undefined
        title: React.ReactNode
        abstract: React.ReactNode
        author: React.ReactNode
        pictureUrl: string | undefined
      }) => (
        <div key={menu._id} className={styles.list_item}>
          <div className={styles.list_item_left}>
            <p
              className={styles.title}
              onClick={() => {
                toDetail(menu._id)
              }}
            >
              {menu.title}
            </p>
            <p>{menu.abstract}</p>
            <p className={styles.author}>{menu.author}</p>
          </div>
          <img
            src={menu.pictureUrl}
            alt=""
            className={styles.img}
            onClick={() => {
              toDetail(menu._id)
            }}
          />
        </div>
      )
    )
    return items
  }

  const generateCarousel = (menus: any) => {
    let items = []
    items = menus.map((menu: any, index: number) => (
      <div key={index}>
        <img src={require(`../../assets/images/banner${index + 1}.jpg`)} alt="" className={styles.carouselImg} />
      </div>
    ))
    return items
  }

  return (
    <div className={styles.home_wrap}>
      <Header />
      <div className={styles.home_content}>
        <Carousel effect="fade" autoplay={true} className={styles.carousel}>
          {generateCarousel(carousels)}
        </Carousel>
        {props.publishedFile.init && (
          <Tloader
            className={styles.tLoader}
            onLoadMore={loadMore}
            autoLoadMore={true}
            hasMore={
              props.publishedFile.data.page.total >
              props.publishedFile.data.datas.length + props.publishedFile.data.page.offset
            }
            initializing={2}
          >
            {generateRecomand(props.publishedFile.data.datas)}
          </Tloader>
        )}
      </div>
    </div>
  )
}
// export default Dashboard

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder,
  publishedFile: state.article.publishedFile
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  getArticleFileById: dispatch.article.getArticleFileById,
  getPublishedFile: dispatch.article.getPublishedFile,
  clearFileContent: dispatch.article.clearFileContent
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
)
