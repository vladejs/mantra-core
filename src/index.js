import {
  useDeps as _useDeps
} from 'nqm-react-simple-di';

import {
  connect as _connect,
  normalizeArray as _normalizeArray
} from 'mobdux';

import App from './app';

import createHOC from './hoc';

// export this module's functions
export const createApp = (...args) => (new App(...args));

// export react-simple-di functions
export const useDeps = _useDeps;

// export mobdux functions
export const normalizeArray = _normalizeArray;

// export main connect method, who injects actions and observable mobx values from stores
// to dumb components
export const connect = (actions2Props, stores2Props) => dumbComponent =>
  useDeps(actions2Props)(
    _connect(stores2Props)(
      createHOC(dumbComponent)
    )
  );
