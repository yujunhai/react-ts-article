import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Tloader from 'react-touch-loader'
import styles from './index.module.less'
import constant from '@/utils/constant.js'
import Header from '@/components/header.tsx'
import { Avatar } from 'antd'

const PersonalArt = (props: any) => {
  const { personPublishedFile, getPersonPublishedFile, match } = props
  const { openid, name } = match.params

  useEffect(() => {
    const obj = {
      openid
    }
    getPersonPublishedFile(obj)
  }, [getPersonPublishedFile, openid])

  const toDetail = (val: any) => {
    window.open(window.origin + `/#/art/articleContent/${val}`)
    // props.history.push(`/art/articleContent/${val}`)
  }

  const loadMore = () => {
    const obj = {
      openid,
      limit: constant.LIMIT,
      offset: personPublishedFile.data.page.offset + personPublishedFile.data.datas.length,
      add: 'add'
    }
    props.getPersonPublishedFile(obj)
  }

  const generateRecomand = (menus: any) => {
    let items = []
    items = menus.map(
      (menu: {
        _id: React.ReactText
        title: React.ReactNode
        abstract: React.ReactNode
        updated_at: string | number | Date
        pictureUrl: string
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
            <p className={styles.author}>
              {menu.updated_at && (new Date(menu.updated_at) as any).format('yyyy-MM-dd hh:mm:ss')}
            </p>
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

  return (
    <div className={styles.home_wrap}>
      <Header />
      <div className={styles.home_content}>
        {props.personPublishedFile.init && (
          <div>
            <div className={styles.title}>
              <Avatar size={64} icon="user" />
              <div className={styles.rightTitle}>
                <p className={styles.name}>{name}</p>
                <p className={styles.total}>篇数: {personPublishedFile.data.page.total}</p>
              </div>
            </div>
            <Tloader
              className={styles.tLoader}
              onLoadMore={loadMore}
              autoLoadMore={true}
              hasMore={
                personPublishedFile.data.page.total >
                personPublishedFile.data.datas.length + personPublishedFile.data.page.offset
              }
              initializing={2}
            >
              {generateRecomand(personPublishedFile.data.datas)}
            </Tloader>
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  personPublishedFile: state.article.personPublishedFile
})

const mapDispatchToProps = (dispatch: any) => ({
  getPersonPublishedFile: dispatch.article.getPersonPublishedFile
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PersonalArt)
)
