import React, { FC } from 'react'
import ReactEcharts from 'echarts-for-react'
import { connect } from 'react-redux'

interface Props extends ReduxProps {
  option: object;
  style?: object;
}

const MyEcharts: FC<Props> = ({
  option = {},
  style = {},
  storeData: { theme }
}) => {
  const themeColor = theme === 'default' ? {} : { theme: 'dark' }
  const options = {
    ...option,
    grid: {
      left: '8%',
      right: '8%',
      top: '6%',
      bottom: '8%'
    }
  }
  return <ReactEcharts option={options} {...themeColor} style={style} />
}

export default connect((state) => state)(MyEcharts)
