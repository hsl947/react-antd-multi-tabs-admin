import React, { FC } from 'react'
import ReactEcharts from 'echarts-for-react'
import { connect } from 'react-redux'

interface Props {
  option: object;
  style?: object;
  theme?: string | undefined;
}

const mapStateToProps = (state: any) => {
  const { theme } = state.storeData
  return {
    theme
  }
}

const MyEcharts: FC<Props> = ({ option = {}, style = {}, theme }) => {
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

export default connect(mapStateToProps)(MyEcharts)
