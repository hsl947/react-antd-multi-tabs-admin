/// <reference types="react-scripts" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "classnames" {
  import classNames from 'classnames'
  export default classNames
}

interface ReduxProps {
  storeData?: Record<any, any>;
  setStoreData?: (type: string, payload: any) => object;
}
