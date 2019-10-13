import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { regular } from '@/utils/validate.js'
import { connect } from 'react-redux'
import styles from './index.module.less'
import imgSrc from '@/assets/images/logo.jpg'
import createApi from '@/api/registerAndLogin/index.js'
import { init, destory } from '@/utils/snow.js'

const Register = (props: any) => {
  const [confirmDirty, setconfirmDirty] = useState(false)
  useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    !document.querySelectorAll('.snowCanvas').length && init()
    return () => {
      if (props.history.location.pathname !== '/register') {
        destory()
      }
    }
  })

  const handleConfirmBlur = (e: { target: { value: any } }) => {
    const value = e.target.value
    setconfirmDirty(confirmDirty || !!value)
  }

  const registerApi = async (obj: any) => {
    const res = await createApi.register(obj)
    if (res.status === 200) {
      props.history.push('/login/register')
    }
  }

  // tslint:disable-next-line: unified-signatures
  const validateToNextPassword = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    const form = props.form
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    if (value && !regular.passWord.test(value)) {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!')
    } else {
      callback()
    }
  }

  // tslint:disable-next-line: unified-signatures
  const compareToFirstPassword = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    const form = props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!')
    } else {
      callback()
    }
  }

  const handleResister = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const obj = {
          name: values.name,
          password: values.password,
          confirmPassword: values.confirm
        }
        registerApi(obj)
      }
    })
  }

  const toLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    props.history.push('/login/register')
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
                  validator: validateToNextPassword
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
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请再次输入密码!'
                },
                {
                  validator: compareToFirstPassword
                }
              ]
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码确认"
                onBlur={handleConfirmBlur}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button className="w100" type="primary" htmlType="submit">
              Register
            </Button>
            <a href="/test" onClick={toLogin}>
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
  )(Form.create()(Register))
)
