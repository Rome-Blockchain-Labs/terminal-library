import { createContext } from 'react'
import { RenderProps } from '../../../types'

const TokenSearchContext = createContext<RenderProps>({ networks: [] })
export default TokenSearchContext