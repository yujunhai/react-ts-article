import React, { useEffect, useState } from 'react'
import { Layout, Icon, Input, Popover, Divider, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Tloader from 'react-touch-loader'
import styles from './index.module.less'
import constant from '@/utils/constant.js'

const { Sider } = Layout

const ArticleSider = (props: any) => {
  const [clientWidth, setclientWidth] = useState(document.body.offsetWidth * 0.14)
  const [showAddClassify, setshowAddClassify] = useState(false) // 是否显示添加文集
  const [folderName, setfolderName] = useState('') // 新建文集的名称
  const [reviseFolderName, setreviseFolderName] = useState('') // 新建文集的名称
  const [reviseFolderId, setreviseFolderId] = useState('') // 修改文集的id
  const [reviseModelShow, setreviseModelShow] = useState(false) // 修改文集的id

  const { articleFolder, getArticleFolder } = props
  useEffect(() => {
    window.addEventListener('resize', () => {
      setclientWidth(document.body.offsetWidth * 0.14)
    })
    const init = () => {
      if (!articleFolder.init) {
        getArticleFolder()
      }
    }
    init()
    return () => {
      window.removeEventListener('resize', () => {
        setclientWidth(document.body.offsetWidth * 0.14)
      })
    }
  }, [articleFolder, getArticleFolder])

  // 加载更多
  const onLoadMore = () => {
    const obj = {
      limit: constant.LIMIT,
      offset: props.articleFolder.data.page.offset + props.articleFolder.data.datas.length,
      add: 'add'
    }
    props.getArticleFolder(obj)
  }
  // 跳转路由
  const toHref = (id: string) => {
    console.log(id)
    if (id) {
      const obj = {
        pathId: id
      }
      props.getArticleFile(obj).then(res => {
        if (res && res.data && res.data.datas && res.data.datas.length) {
          props.getArticleFileById(res.data.datas[0]._id).then(() => {
            props.history.push(`/article/notebooks/${id}/notes/${res.data.datas[0]._id}`)
          })
        } else {
          props.clearFileContent().then(() => {
            props.history.push(`/article/notebooks/${id}/notes`)
          })
        }
      })
    } else {
      props.history.push(`/article/notebooks`)
    }
  }

  // 修改编辑文集的名称
  const reviseFolder = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: React.SetStateAction<string>,
    name: React.SetStateAction<string>
  ) => {
    e.stopPropagation()
    setreviseFolderId(id)
    setreviseFolderName(name)
    setreviseModelShow(true)
  }

  // 删除文集
  const deleteFolder = (id, name) => {
    console.log(id, name)
    let nextId = ''
    props.articleFolder.data.datas.map((item, index) => {
      if (item._id === id && index !== props.articleFolder.data.datas.length - 1) {
        nextId = props.articleFolder.data.datas[index + 1]._id
      } else if (item._id === id && index === props.articleFolder.data.datas.length - 1) {
        nextId = index !== 0 ? props.articleFolder.data.datas[index - 1]._id : ''
      }
      return nextId
    })
    Modal.confirm({
      content: `确认删除文集《${name}》，文章将被移动到回收站。`,
      okText: '确定',
      cancelText: '取消',
      className: 'noIcon',
      onOk: () => {
        const obj = {
          id
        }
        props.deletePath(obj).then(() => {
          // console.log(nextId)
          toHref(nextId)
        })
      }
    })
  }

  // popup
  const popoverContent = (id, name) => (
    <div>
      <div
        className="popoverLi_item"
        onClick={e => {
          reviseFolder(e, id, name)
        }}
      >
        <Icon type="edit" />
        修改文集
      </div>
      <Divider className={styles.Divider} />
      <div
        className="popoverLi_item"
        onClick={() => {
          deleteFolder(id, name)
        }}
      >
        <Icon type="delete" />
        删除文集
      </div>
    </div>
  )

  const generateMenu = menus => {
    let items = []
    items = menus.map(menu => (
      <div
        key={menu._id}
        className={`${styles.menu_item}
          ${props.match.params.folder === menu._id && styles.menu_item_active}`}
      >
        <div
          className={styles.menu_text}
          onClick={() => {
            toHref(menu._id)
          }}
        >
          {menu.pathName}
        </div>
        {props.match.params.folder === menu._id && (
          <Popover
            placement="bottomRight"
            content={popoverContent(menu._id, menu.pathName)}
            trigger="hover"
            className={styles.setting_Popover}
          >
            <Icon type="setting" className={styles.icon_setting} />
          </Popover>
        )}
      </div>
    ))
    return items
  }

  // 回首页
  const toHome = () => {
    props.history.push('/')
  }

  // 点击确定修改文集
  const confirmReviseFolder = () => {
    const obj = {
      id: reviseFolderId,
      pathName: reviseFolderName,
      openid: props.userInfo.openid
    }
    props.renamePath(obj).then(() => {
      cancleReviseFolder()
      toHref(reviseFolderId)
    })
  }

  // 取消修改文集, 重置
  const cancleReviseFolder = () => {
    setreviseFolderName('')
    setreviseFolderId('')
    setreviseModelShow(false)
  }

  // 添加文集
  const handleAddFolders = () => {
    const obj = {
      pathName: folderName,
      openid: props.userInfo.openid,
      author: props.userInfo.name
    }
    props.createPath(obj).then(res => {
      setfolderName('')
      setshowAddClassify(false)
      toHref(res.data.datas[0]._id)
    })
  }
  return (
    <Sider className={styles.article_sider} width={clientWidth} theme="dark">
      <div
        className={styles.back_home_btn}
        onClick={() => {
          toHome()
        }}
      >
        回 首 页
      </div>
      {
        <div className={styles.add_article}>
          <p
            className={styles.add_article_p}
            onClick={() => {
              setshowAddClassify(true)
            }}
          >
            <Icon type="plus" />
            新建文集
          </p>
          <div className={showAddClassify ? styles.add_article_form : styles.add_article_form_hide}>
            <Input
              value={folderName}
              placeholder="请输入文集名..."
              className={styles.article_name_input}
              onPressEnter={handleAddFolders}
              onChange={e => {
                setfolderName(e.target.value)
              }}
            />
            <div className={`flex ${styles.add_article_confirm}`}>
              <div className={styles.submit_btn} onClick={handleAddFolders}>
                提交
              </div>
              <span
                className={`cursor ${styles.cancel_word}`}
                onClick={() => {
                  setfolderName('')
                  setshowAddClassify(false)
                }}
              >
                取消
              </span>
            </div>
          </div>
        </div>
      }
      <div className={styles.menu_wrap}>
        <div>
          {props.articleFolder.init && (
            <Tloader
              className={styles.tLoader}
              onLoadMore={onLoadMore}
              autoLoadMore={true}
              hasMore={
                props.articleFolder.data.page.total >
                props.articleFolder.data.datas.length + props.articleFolder.data.page.offset
              }
              initializing={2}
            >
              {generateMenu(props.articleFolder.data.datas)}
            </Tloader>
          )}
        </div>
      </div>
      <Modal
        title="请输入新文集名"
        visible={reviseModelShow}
        onOk={confirmReviseFolder}
        onCancel={cancleReviseFolder}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={reviseFolderName}
          onChange={e => {
            setreviseFolderName(e.target.value)
          }}
          onPressEnter={confirmReviseFolder}
        />
      </Modal>
    </Sider>
  )
}

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder,
  userInfo: state.account.userInfo
})

const mapDispatchToProps = (dispatch: any) => ({
  createPath: dispatch.article.createPath,
  deletePath: dispatch.article.deletePath,
  renamePath: dispatch.article.renamePath,
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  getArticleFileById: dispatch.article.getArticleFileById,
  clearFileContent: dispatch.article.clearFileContent
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticleSider)
)
