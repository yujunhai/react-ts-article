import React from 'react'
import { Layout, BackTop } from 'antd'
import ArticleSider from './articleSider'
// import NoteBooks from './notesBooks'
// import Notes from './notes'

const Article = () => {
  return (
    <Layout className="app-layout">
      <BackTop />
      <ArticleSider />
      {/* <NoteBooks />
      <Notes /> */}
    </Layout>
  )
}

export default Article
