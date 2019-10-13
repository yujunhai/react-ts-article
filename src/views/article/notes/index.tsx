import React, { useEffect, useState } from 'react'
import { Layout, Icon, Input, Upload, Button, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './index.module.less'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { getToken } from '@/api/axios.js'

declare global {
  interface Window {
    previewWindow: any
  }
}

const { Content } = Layout
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_558012_rlj4y8cy1uo.js'
})
const excludeControls = ['link', 'text-indent', 'fullscreen']

const Notes = (props: any) => {
  const [editorState, seteditorState] = useState(BraftEditor.createEditorState(null))
  const [saveIng, setsaveIng] = useState(false) // 保存的一个状态
  const [publishStatus, setpublishStatus] = useState(0) // 0 还没发布  1 已经发布 2 发布未更新
  const [title, settitle] = useState('') // 文章标题
  const [hoverStatus, sethoverStatus] = useState(false)
  const [thumbnailUrl, setthumbnailUrl] = useState('') // 缩列图
  const [lastHtml, setlastHtml] = useState('') // 最后保存的html ，做对比判断是否需要重新保存内容

  const { articleFileContent } = props
  useEffect(() => {
    const init = () => {
      if (articleFileContent && articleFileContent.data) {
        settitle(articleFileContent.data.title)
        setthumbnailUrl(articleFileContent.data.pictureUrl || '')
        seteditorState(BraftEditor.createEditorState(articleFileContent.data.content))
        setlastHtml(articleFileContent.data.content)
        if (articleFileContent.data.status === 1) {
          if (
            (new Date(articleFileContent.data.updated_at) as any) -
              (new Date(articleFileContent.data.posted_at) as any) >
            0
          ) {
            setpublishStatus(2)
          } else {
            setpublishStatus(1)
          }
        } else {
          setpublishStatus(0)
        }
      }
    }
    init()
  }, [articleFileContent])

  // 更新发布或者取消发布
  const publishNow = () => {
    // 发布之前先保存内容，再发布
    const divDom = document.createElement('div')
    divDom.innerHTML = editorState.toHTML()
    const sendText = divDom.innerText.replace(/\s/g, '')
    const obj = {
      id: props.match.params.file,
      title,
      content: editorState.toHTML(),
      pathId: props.match.params.folder,
      abstract: sendText.length > 100 ? `${sendText.substring(0, 100)}...` : sendText
    }
    if (thumbnailUrl) {
      // tslint:disable-next-line
      ;(obj as any).pictureUrl = thumbnailUrl
    }
    props.UpdateArticleInfoById(obj).then(() => {
      const updateObj = {
        id: props.match.params.file,
        status: publishStatus === 1 ? 0 : 1,
        pathId: props.match.params.folder
      }
      props.UpdateArticleStatusById(updateObj).then(res => {
        if (res.data.status === 1) {
          if ((new Date(res.data.updated_at) as any) - (new Date(res.data.posted_at) as any) > 0) {
            setpublishStatus(2)
          } else {
            setpublishStatus(1)
          }
        } else {
          setpublishStatus(0)
        }
      })
    })
  }

  const buildPreviewHtml = () => {
    return `
    <!Doctype html>
    <html>
      <head>
        <title>Preview Content</title>
        <style>
          html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #f1f2f3;
          }
          .container{
            box-sizing: border-box;
            width: 1000px;
            max-width: 100%;
            min-height: 100%;
            margin: 0 auto;
            padding: 30px 20px;
            overflow: hidden;
            background-color: #fff;
            border-right: solid 1px #eee;
            border-left: solid 1px #eee;
          }
          .container img,
          .container audio,
          .container video{
            max-width: 100%;
            height: auto;
          }
          .container p{
            white-space: pre-wrap;
            min-height: 1em;
          }
          .container pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
          .container blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
        </style>
      </head>
      <body>
        <div class="container">${editorState.toHTML()}</div>
      </body>
    </html>
  `
  }

  const preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open()
    window.previewWindow.document.write(buildPreviewHtml())
    window.previewWindow.document.close()
  }

  const onChangeTitle = (e: { target: { value: React.SetStateAction<string> } }) => {
    settitle(e.target.value)
  }

  const changeTitleBlur = () => {
    // 修改标题
    const obj = {
      id: props.match.params.file,
      title,
      content: editorState.toHTML(),
      pathId: props.match.params.folder
    }
    if (thumbnailUrl) {
      // tslint:disable-next-line
      ;(obj as any).pictureUrl = thumbnailUrl
    }
    props.UpdateArticleInfoById(obj).then(() => {
      props.getArticleFileById(props.match.params.file)
    })
  }

  const updateArticle = async () => {
    setsaveIng(true)
    const divDom = document.createElement('div')
    divDom.innerHTML = editorState.toHTML()
    const sendText = divDom.innerText.replace(/\s/g, '')
    console.log(sendText)

    if (lastHtml !== editorState.toHTML()) {
      const obj = {
        id: props.match.params.file,
        title,
        content: editorState.toHTML(),
        pathId: props.match.params.folder
      }
      const abstract = sendText.length > 100 ? `${sendText.substring(0, 100)}...` : sendText
      if (thumbnailUrl) {
        // tslint:disable-next-line
        ;(obj as any).pictureUrl = thumbnailUrl
      }
      if (abstract) {
        // tslint:disable-next-line
        ;(obj as any).abstract = abstract
      }
      console.log(obj)
      props.UpdateArticleInfoById(obj).then(() => {
        setlastHtml(editorState.toHTML())
        props.getArticleFileById(props.match.params.file).then(() => {
          if (props.articleFileContent.data.status === 1) {
            console.log(
              (new Date(props.articleFileContent.data.updated_at) as any) -
                (new Date(props.articleFileContent.data.posted_at) as any)
            )
            if (
              (new Date(props.articleFileContent.data.updated_at) as any) -
                (new Date(props.articleFileContent.data.posted_at) as any) >
              0
            ) {
              setpublishStatus(2)
            } else {
              setpublishStatus(1)
            }
          } else {
            setpublishStatus(0)
          }
          setsaveIng(false)
          return new Promise(resolve => resolve())
        })
      })
    }
    setsaveIng(false)
  }

  // tslint:disable-next-line: no-shadowed-variable
  const handleChange = (editorState: any) => {
    seteditorState(editorState)
  }

  const extendControls = [
    {
      key: 'save-button',
      type: 'button',
      title: '保存',
      text: <Icon type="save" />,
      onClick: updateArticle
    },
    {
      key: 'publish-button',
      type: 'button',
      text: (
        <div>
          {publishStatus === 0 ? (
            <p>
              <IconFont type="icon-bushufabu" />
              发布文章
            </p>
          ) : publishStatus === 1 ? (
            <p
              onMouseEnter={() => {
                sethoverStatus(true)
              }}
              onMouseLeave={() => {
                sethoverStatus(false)
              }}
            >
              <Icon type={hoverStatus ? 'close' : 'check'} />
              {hoverStatus ? '取消发布' : '已经发布'}
            </p>
          ) : (
            <p>
              <Icon type="sync" />
              更新发布
            </p>
          )}
        </div>
      ),
      onClick: () => {
        publishNow()
      }
    },
    'fullscreen',
    {
      key: 'custom-button',
      type: 'button',
      text: '预览',
      onClick: preview
    }
  ]

  const uploadProps = {
    action: '/api/common/uploadFile',
    showUploadList: false,
    headers: {
      Authorization: getToken()
    },
    onChange: (res: any) => {
      if (res.file && res.file.response && res.file.response.status === 200) {
        setthumbnailUrl(res.file.response.data.url)
      }
    }
  }
  return (
    <Content className={`article_edit ${styles.article_edit}`}>
      {!(props.articleFileContent.data && props.articleFileContent.data.title) ? (
        <div className={styles.article_edit_no_content}>
          <span className={styles.no_content_word}>Catherine</span>
        </div>
      ) : (
        <div className={styles.article_edit_content}>
          <div className={styles.edit_title}>
            <p className={styles.edit_status}>{saveIng ? '保存中...' : '已保存'}</p>
            <Input value={title} onChange={onChangeTitle} className={styles.edit_title_p} onBlur={changeTitleBlur} />
          </div>
          <div className={styles.thumbnail_url}>
            <Upload className="avatar-uploader" {...uploadProps}>
              <Button type="primary">{thumbnailUrl ? '修改缩列图' : '设置缩列图'}</Button>
            </Upload>
            {thumbnailUrl ? (
              <img src={thumbnailUrl} className={styles.Avatar} alt="缩列图" />
            ) : (
              <Avatar className={styles.Avatar} />
            )}
          </div>
          <BraftEditor
            value={editorState}
            onChange={handleChange}
            onBlur={updateArticle}
            onSave={updateArticle}
            excludeControls={excludeControls as any}
            extendControls={extendControls as any}
          />
        </div>
      )}
    </Content>
  )
}

const mapStateToProps = (state: any) => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder,
  articleFileContent: state.article.articleFileContent
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  UpdateArticleInfoById: dispatch.article.UpdateArticleInfoById,
  getArticleFileById: dispatch.article.getArticleFileById,
  UpdateArticleStatusById: dispatch.article.UpdateArticleStatusById
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notes)
)
