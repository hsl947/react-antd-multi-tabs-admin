/// <reference types="react-scripts" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "classnames" {
  import classNames from 'classnames'
  export default classNames
}

interface ReduxProps {
  storeData?: Record<string, any>;
  setStoreData?: (type: string, payload: any) => object;
}

type RefType = MutableRefObject<unknown> | ((instance: unknown) => void)

type CommonObjectType<T = any> = Record<string, T>
