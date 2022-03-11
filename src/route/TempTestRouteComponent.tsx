import React, { FC } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { Typography, Space } from 'antd'
import ReactJson from 'react-json-view'

interface Props {
  apiUrl: string
  placeHolder?: string
  title?: string
  slice?: number | number[]
}

const { Text, Title } = Typography
const ApiPlay: FC<Props> = ({ apiUrl, placeHolder, title, slice }) => {
  const { loading, error, data } = useFetch(apiUrl)
  const slicedData = slice !== undefined ? data?.slice(...[slice].flat()) : data
  const loadingPlaceHolder = placeHolder || 'Fetching data...'
  // Handle the loading state
  if (loading) {
    return <Title type="warning">{loadingPlaceHolder}</Title>
  }

  // And the error state
  if (error) {
    return (
      <div>
        <Title>{title || 'API mocking example'}</Title>
        <Text type="danger">Error: {error.message || error}</Text>
        <div>Refresh the page if this error is unintentional.</div>
      </div>
    )
  }

  // Finally, render JSX with the response data
  return (
    <div className="App">
      <Title>{title || 'API mocking example'}</Title>
      <h2>
        <Text type="secondary">{`请求${apiUrl}`}</Text>
      </h2>
      <ReactJson src={slicedData} name={null} theme="monokai" collapsed={2} />
      <p>
        <small>
          编辑 <code>src/mocks</code>下的文件(热更新/热替换),修改模拟API.
        </small>
      </p>
    </div>
  )
}
export const TestApiLoad = () => (
  <div>
    <h1>API mocking </h1>
    <Title level={2}>同时有mock,proxy和真实api的情况下,响应优先级顺序:</Title>
    <Space direction="vertical">
      <Text>1.msw模拟</Text>
      <Text>2.proxy反向代理</Text>
      <Text>3.直接请求</Text>
    </Space>
    <ApiPlay
      apiUrl="https://jsonplaceholder.typicode.com/users"
      slice={[0, 2]}
      title="case1: 直接访问外部Api"
      placeHolder="case1: 加载中.."
    />
    <ApiPlay
      apiUrl="/external-api/users"
      title="case2:外部Api代理 https://jsonplaceholder.typicode.com/users"
      slice={[1, 3]}
      placeHolder="case2: 加载中.."
    />
    <ApiPlay
      apiUrl="/api/people"
      title="case3:内部代理-此处指向不可用的代理,故不可用"
      placeHolder="case3: 加载中.."
    />
    <ApiPlay
      apiUrl="/people"
      title="case4: msw代理"
      placeHolder="case4: 加载中.."
    />
  </div>
)
