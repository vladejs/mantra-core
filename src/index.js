import {
    useDeps as _useDeps
} from 'react-simple-di';

import {
    connect as _connect,
    normalizeArray as _normalizeArray
} from 'mobdux';

import App from './app';

// export this module's functions
export const createApp = (...args) => (new App(...args));

// export react-simple-di functions
export const useDeps = _useDeps;

export const connect = (actions2Props, stores2Props) =>
    dumbComponent => useDeps(actions2Props)(
        _connect(stores2Props)(dumbComponent)
    );

export const normalizeArray = _normalizeArray;
