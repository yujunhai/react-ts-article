import React, { useEffect } from 'react'
import styles from './index.module.less'
import { connect } from 'react-redux'

const ArticleContent = (props: any) => {
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    console.log(props.articleFileContent)
    props.getArticleFileById(props.match.params.id)
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [props.match.params.id])

  return (
    <div className={styles.article_content_wrap}>
      {props.articleFileContent && props.articleFileContent.data ? (
        <div className={styles.article_content}>
          <div className={styles.title}>{props.articleFileContent.data.title}</div>
          <div className={styles.desc}>
            <span>
              {props.articleFileContent.data.updated_at &&
                (new Date(props.articleFileContent.data.updated_at) as any).format('yyyy-MM-dd hh:mm:ss')}
            </span>
            <span className={styles.author}>{props.articleFileContent.data.author}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: props.articleFileContent.data.content }} />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
// export default ArticleContent

const mapStateToProps = (state: any) => ({
  articleFileContent: state.article.articleFileContent
})

const mapDispatchToProps = (dispatch: any) => ({
  getArticleFileById: dispatch.article.getArticleFileById
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleContent)
