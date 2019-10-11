import React, { useEffect, useState } from 'react'
import { Layout, Icon, Input, Popover, Divider, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './index.module.less'
import { getNowFormatDate } from '@/utils/index.js'
import Tloader from 'react-touch-loader'
import constant from '@/utils/constant.js'

const { Sider } = Layout
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_558012_rlj4y8cy1uo.js'
})

const ArticleSider = (props: any) => {
  const [clientWidth, setclientWidth] = useState(document.body.offsetWidth * 0.2)
  const [addIng, setaddIng] = useState(false)

  const init = id => {
    const obj = {
      pathId: props.match.params.folder,
      limit: props.articleFile.data.page.offset + props.articleFile.data.datas.length || 10,
      offset: 0
    }
    props.getArticleFile(obj).then(() => {
      if (id) {
        props.history.push(`/article/notebooks/${props.match.params.folder}/notes/${id}`)
      }
    })
  }

  const addArticle = () => {
    console.log('add')
    setaddIng(true)
    const obj = {
      pathId: props.match.params.folder,
      title: getNowFormatDate()
    }
    props.createArticle(obj).then(res => {
      setaddIng(false)
      toHref(res.data.datas[0]._id)
    })
  }
  const toHref = id => {
    props.getArticleFileById(id).then(() => {
      props.history.push(`/article/notebooks/${props.match.params.folder}/notes/${id}`)
    })
  }

  const publishNow = (id, title) => {
    console.log(id, title)
    const obj = {
      id,
      pathId: props.match.params.folder,
      status: 1
    }
    props.UpdateArticleStatusById(obj)
  }

  const deleteFile = (id, title) => {
    let nextId = ''
    props.articleFile.data.datas.map((item, index) => {
      if (item._id === id && index !== props.articleFile.data.datas.length - 1) {
        nextId = props.articleFile.data.datas[index + 1]._id
      } else if (item._id === id && index === props.articleFile.data.datas.length - 1) {
        nextId = props.articleFile.data.datas[index - 1]._id
      }
    })
    Modal.confirm({
      content: `确认删除文章《${title}》，文章将被移动到回收站。`,
      okText: '确定',
      cancelText: '取消',
      className: 'noIcon',
      onOk: () => {
        const obj = {
          id,
          pathId: props.match.params.folder
        }
        props.deleteArticle(obj).then(() => {
          toHref(nextId)
        })
      }
    })
  }

  const popoverContent = (id, title, debug) => (
    <div>
      <div
        className="popoverLi_item"
        onClick={() => {
          publishNow(id, title)
        }}
      >
        <IconFont type="icon-bushufabu" />
        直接发布
      </div>
      <Divider className={styles.Divider} />
      <div
        className="popoverLi_item"
        onClick={() => {
          deleteFile(id, title)
        }}
      >
        <Icon type="delete" />
        删除文章
      </div>
    </div>
  )

  const generateMenu = menus => {
    let items = []
    items = menus.map(menu => (
      // <Menu.Item
      <div
        key={menu._id}
        className={`${styles.menu_item}
        ${props.match.params.file === menu._id && styles.menu_item_active}`}
        onClick={() => {
          toHref(menu._id)
        }}
      >
        <span>
          {menu.status !== 1 ? (
            <Icon type="file" className={styles.file_Icon} />
          ) : (
            <Icon type="file-done" className={`${styles.file_done} ${styles.file_Icon}`} />
          )}
          <span className="nav-text">{menu.title}</span>
        </span>
        <Popover
          placement="bottomRight"
          content={popoverContent(menu._id, menu.title, menu.debug)}
          trigger="hover"
          className={styles.setting_Popover}
        >
          <Icon type="setting" />
        </Popover>
      </div>
    ))
    return items
  }

  return (
    <Sider className={styles.article_noteBooks} width={clientWidth} theme="light">
      <div className={styles.add_mid_article} onClick={() => addArticle()}>
        <Icon type="plus" className={styles.add_icon} />
        新建文章{addIng && '中...'}
      </div>
      <div>
        {props.articleFile.init && (
          <Tloader
            className={styles.tLoader}
            onLoadMore={
              props.articleFile.data.page.total >
              props.articleFile.data.datas.length + props.articleFile.data.page.offset
            }
            autoLoadMore={true}
            hasMore={false}
            initializing={2}
          >
            {generateMenu(props.articleFile.data.datas)}
          </Tloader>
        )}
      </div>
    </Sider>
  )
}

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  createArticle: dispatch.article.createArticle,
  deleteArticle: dispatch.article.deleteArticle,
  UpdateArticleStatusById: dispatch.article.UpdateArticleStatusById,
  getArticleFileById: dispatch.article.getArticleFileById
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticleSider)
)
