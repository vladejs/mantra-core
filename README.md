# MantraX - Mantra Architecture redesigned to work with MobX 3.x and Meteor 1.5+

MantraX deprecates old dependencies like React komposer 1.x in favor of Mobdux, a library
that uses mobx-react's under the hood in order to bind MobX stores to dumb components in a Redux manner.

You can start Mantra apps as usual, with the difference that you can now add a Mobx store to the `context`
object and it will be available on Containers files.

## Installation

```
npm i --save mantrax
```

## App API

### App initialization
```js
// client/main.js
import { createApp } from 'mantrax';
import initContext from './imports/configs/context';

// modules
import coreModule from './imports/modules/core/index';
import authModule from './imports/modules/auth/index';

// init context
const context = initContext({ Store: coreModule.stores });

// create app
const app = createApp(context);

// load modules
app.loadModule(authModule);
app.loadModule(coreModule);
app.init();
```

### Module creation

```
// client/imports/modules/core/index

import actions from './actions';
import routes from './routes.jsx';
import stores from './stores';
import autoruns from './autoruns';

export default {
  routes,
  stores,
  actions,
  autoruns,
  load(_context, _actions, _autoruns) {
      console.log('has autoruns?');
      console.log(_autoruns);
  }
};
```

## Containers definition

```
// client/imports/modules/core/containers/todos

import { connect } from 'mantrax';

import HomeTodos from '../components/todos.jsx';

const fromActionsToProps = (context, actions) => {
  // initialize a subscription to DB that automatically syncs with a mobx store's value
  context.autoruns.todos().start();

  return {
    goAbout: actions.routes.goAbout
    insertTodo: actions.todos.insertTodo
  };
};

const fromStoresToProps = (Stores, ownProps) => ({
  todos: Stores.core.todoStore.todos.toJS(),
  hasTodos: Stores.core.todoStore.hasTodos // a computed function from the MobX store
});

export default connect(fromActionsToProps, fromStoresToProps)(HomeTodos);
```

## Benefits

* `HomeTodos` component will get 4 props: 2 actions and 2 store's values.
* `todos` value is automatically fill from a Meteor subscription created on `autoruns` folder.
* The Dumb component `HomeTodos` doesn't know about `mobx-react` (doesn't need the @observer decorator).
* If you know connect API from Redux you know MantraX.
