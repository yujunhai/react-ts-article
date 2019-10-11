import React, { useEffect } from 'react'
import { Button, Form, Input, Icon, Checkbox } from 'antd'
import { withRouter } from 'react-router-dom'
import { regular } from '@/utils/validate.js'
import { connect } from 'react-redux'
import styles from './index.module.less'
import imgSrc from '@/assets/images/logo.jpg'
import createApi from '@/api/registerAndLogin/index.js'
import { init, destory } from '@/utils/snow.js'
import { getParams } from '@/utils/index.js'

const Login = (props: any) => {
  useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    !document.querySelectorAll('.snowCanvas').length && init()

    return () => {
      if (props.history.location.pathname !== '/login') {
        console.log(props)
        destory()
      }
    }
  }, [])

  const validateToPassword = (rule: any, value: any, callback: any) => {
    if (value && !regular.passWord.test(value)) {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!')
    } else {
      callback()
    }
  }

  const loginApi = async (obj: { name: any; password: any }) => {
    const res = await createApi.login(obj)
    console.log(res)
    if (res.status === 200) {
      sessionStorage.setItem('isLogin', JSON.stringify(true))
      sessionStorage.setItem('userInfo', JSON.stringify(res.data))
      console.log(props)
      if (getParams('flag') - 0 === 1) {
        if (!props.articleFolder.init) {
          props.getArticleFolder().then(val => {
            if (val && val.data && val.data.page && val.data.page.total) {
              const sendObj = {
                pathId: val.data.datas[0]._id
              }
              props.getArticleFile(sendObj).then(result => {
                if (result && result.data && result.data.datas && result.data.datas.length) {
                  props.getArticleFileById(result.data.datas[0]._id).then(() => {
                    props.history.push(`/article/notebooks/${val.data.datas[0]._id}/notes/${result.data.datas[0]._id}`)
                  })
                } else {
                  props.clearFileContent().then(() => {
                    props.history.push(`/article/notebooks/${val.data.datas[0]._id}/notes`)
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
            const sendObj = {
              pathId: props.articleFolder.data.datas[0]._id
            }
            props.getArticleFile(sendObj).then(result => {
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
      } else {
        props.history.goBack()
      }
    }
  }

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err: any, values: { name: any; password: any }) => {
      if (!err) {
        const obj = {
          name: values.name,
          password: values.password
        }
        loginApi(obj)
      }
    })
  }

  const toResister = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    props.history.push('/register')
  }
  const { getFieldDecorator } = props.form
  return (
    <div className={styles.login_wrap_out}>
      <div className={styles.login_wrap}>
        <div className="text-center">
          <img src={imgSrc} width="100" height="100" alt="logo" className={styles.logo} />
        </div>
        <Form onSubmit={handleLogin}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入用户名!' }]
            })(
              <Input
                size="large"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="账号"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码!' },
                {
                  validator: validateToPassword
                }
              ]
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            <Button className="w100" type="primary" htmlType="submit">
              Log in
            </Button>
            <a href="/test" onClick={toResister}>
              没有账号？点击注册
            </a>
          </Form.Item>
        </Form>
        <h1 className="text-center" style={{ color: '#333', fontSize: '12px' }}>
          Catherine Platform
        </h1>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  snow: state.animate.snow,
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder
})

const mapDispatchToProps = (dispatch: any) => ({
  getSnow: dispatch.animate.getSnow,
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder,
  getArticleFileById: dispatch.article.getArticleFileById,
  clearFileContent: dispatch.article.clearFileContent
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Login))
)
