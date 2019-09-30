import React, { useEffect, useState } from 'react'
import { Layout, Icon, Input, Popover, Divider, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Tloader from 'react-touch-loader'
import styles from './index.module.less'
import createApi from '@/api/article/index.js'

const { Sider } = Layout

const ArticleSider = (props: any) => {
  const [clientWidth, setclientWidth] = useState(document.body.offsetWidth * 0.14)
  const [showAddClassify, setshowAddClassify] = useState(false)
  const [folderName, setfolderName] = useState('')
  //   const [reviseFolderName, setreviseFolderName] = useState(document.body.offsetWidth * 0.14)
  //   const [reviseFolderId, setreviseFolderId] = useState(document.body.offsetWidth * 0.14)

  const toHome = () => {
    props.history.back()
  }

  const onChangeName = e => {
    setfolderName(e.target.value)
  }

  const handleAddFolders = () => {
    // this.addFolder(obj)
  }
  return (
    <Sider className={styles.article_sider} width={clientWidth} theme="light">
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
              //   this.setState({ showAddClassify: true })
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
              onChange={onChangeName}
            />
            <div className={`flex ${styles.add_article_confirm}`}>
              <div className={styles.submit_btn} onClick={handleAddFolders}>
                提交
              </div>
              <span
                className={`cursor ${styles.cancel_word}`}
                onClick={() => {
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
        {/* <Menu theme="dark" mode="inline"> */}
        {/* <div>
          <Tloader
            className={styles.tLoader}
            onRefresh={this.refresh}
            onLoadMore={this.loadMore}
            autoLoadMore
            hasMore={hasMore}
            initializing={initializing}
          >
            {this.generateMenu(ownMenuArr)}
          </Tloader>
        </div> */}
      </div>
      {/* <Modal
        title="请输入新文集名"
        visible={this.state.reviseModelShow}
        onOk={this.confirmReviseFolder}
        onCancel={this.cancleReviseFolder}
        okText="确认"
        cancelText="取消"
      >
        <Input value={this.state.reviseFolderName} onChange={this.onChangeFolderName} />
      </Modal> */}
    </Sider>
  )
}

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticleSider)
)
