import React from 'react'
import { Input } from 'antd'

const Page2 = () => {
  return (
    // eslint-disable-next-line jsx-a11y/accessible-emoji
    <div style={{ fontSize: '30px' }}>
      🐋😀😆😅🤣😙😎☹️🙁🤓🧐😕😟🥺😩😫🤩🥳😟️🤣🤡👺👹😈😾🤜🏽🏽🦿
      <Input
        type="text"
        placeholder="输入后切换页面，测试持久化"
        style={{ margin: '20px' }}
      />
    </div>
  )
}

export default Page2
