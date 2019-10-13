import React from 'react'
import { Input, Icon, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './header.module.less'

const { Search } = Input

const Header = (props: any) => {
  const toHref = (val: string) => {
    props.history.push(val)
  }

  const toWrite = () => {
    const isLogin = props.isLogin
    if (!isLogin) {
      props.history.push('/login/write')
      return
    }
    if (!props.articleFolder.init) {
      props.getArticleFolder().then(res => {
        if (res && res.data && res.data.page && res.data.page.total) {
          const obj = {
            pathId: res.data.datas[0]._id
          }
          props.getArticleFile(obj).then(result => {
            if (result && result.data && result.data.datas && result.data.datas.length) {
              props.getArticleFileById(result.data.datas[0]._id).then(() => {
                props.history.push(`/article/notebooks/${res.data.datas[0]._id}/notes/${result.data.datas[0]._id}`)
              })
            } else {
              props.clearFileContent().then(() => {
                props.history.push(`/article/notebooks/${res.data.datas[0]._id}/notes`)
              })
            }
          })
        } else {
          props.history.push(`/article/notebooks`)
        }
      })
    } else {
      if (
        props.articleFolder &&
        props.articleFolder.data &&
        props.articleFolder.data.page &&
        props.articleFolder.data.page.total
      ) {
        const obj = {
          pathId: props.articleFolder.data.datas[0]._id
        }
        props.getArticleFile(obj).then(result => {
          if (result && result.data && result.data.datas && result.data.datas.length) {
            props.getArticleFileById(result.data.datas[0]._id).then(() => {
              props.history.push(
                `/article/notebooks/${props.articleFolder.data.datas[0]._id}/notes/${result.data.datas[0]._id}`
              )
            })
          } else {
            props.clearFileContent().then(() => {
              props.history.push(`/article/notebooks/${props.articleFolder.data.datas[0]._id}/notes`)
            })
          }
        })
      } else {
        props.history.push(`/article/notebooks`)
      }
    }
  }

  return (
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
            // toHref('/article/notebooks')
            toWrite()
          }}
        >
          写文章
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder,
  isLogin: state.account.isLogin
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  getArticleFileById: dispatch.article.getArticleFileById,
  clearFileContent: dispatch.article.clearFileContent
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
)
