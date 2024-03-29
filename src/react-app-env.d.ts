/// <reference types="react-scripts" />

declare module '*.module.less' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.js'
declare module '*.tsx'
declare module 'react-router-dom'
declare module 'react-redux'
