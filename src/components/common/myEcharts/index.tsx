import React, { FC } from 'react'
import ReactEcharts from 'echarts-for-react'
import { useAppSelector } from '@/store/redux-hooks'
import { selectTheme } from '@/store/slicers/appSlice'

interface Props {
  option: object
  style?: object
}

const MyEcharts: FC<Props> = ({ option = {}, style = {} }) => {
  const theme = useAppSelector(selectTheme)
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

export default MyEcharts
