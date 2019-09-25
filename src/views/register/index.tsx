import React, { useEffect } from 'react'
import { Button, Form, Input, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { regular } from '@/utils/validate.js'
import { connect } from 'react-redux'
import styles from './index.module.less'
import imgSrc from '@/assets/images/logo.jpg'
import createApi from '@/api/registerAndLogin/index.js'

const Login = (props: any) => {
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    // loading.start()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  useEffect(() => {
    console.log('componentDidUpdate： 更新usernmae')
  }, [])

  const validateToPassword = (rule: any, value: any, callback: any) => {
    if (value && !regular.passWord.test(value)) {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!')
    } else {
      callback()
    }
  }

  const registerApi = async obj => {
    const res = await createApi.register(obj)
    console.log(res)
  }

  const handleResister = (e: { preventDefault: () => void }) => {
    // sessionStorage.setItem('isLogin', JSON.stringify(true))
    // console.log(props)
    // props.history.push('/admin')
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // const obj = {
        //   name: values.user,
        //   password: values.password,
        //   confirm_pwd: values.confirm
        // }
        registerApi(values)
      }
    })
  }

  const toLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    props.history.push('/login')
  }

  const { getFieldDecorator } = props.form
  return (
    <div className={styles.login_wrap_out}>
      <div className={styles.login_wrap}>
        <div className="text-center">
          <img src={imgSrc} width="100" height="100" alt="logo" className={styles.logo} />
        </div>
        <Form onSubmit={handleResister}>
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
            <Button className="w100" type="primary" htmlType="submit">
              Register
            </Button>
            <a href="#" onClick={toLogin}>
              已有账号,点击登录!
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
  test: state.demo.test
})

const mapDispatchToProps = (dispatch: any) => ({
  getTest: dispatch.demo.getTest
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Login))
)
