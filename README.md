# Mantra Phoenix: Mantra Architecture extended to work with MobX 3+ and Meteor 1.5+

Mantra Phoenix deprecates old dependencies like React komposer 1.x in favor of Mobdux, a library
that uses MobX and mobx-react under the hood in order to bind MobX stores to dumb components in a Redux manner.

You can start Mantra apps as usual, with the difference that you can now add a Mobx store to the `context`
object (by just exporting the store on module initialization) and it will be available on Containers files.

## Installation

```
npm i --save mantrax
```

> In order to sync with a Meteor Collection, use alongside vladejs:tracker-mobx-autorun package.

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
const context = initContext();

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

// MobX Stores: Will be available on context.stores automatically
import stores from './stores';

// Functions that automatically syncs MongoDB collections with the Mobx store
// Will be available under context.autoruns (see implementation below)
import autoruns from './autoruns';

export default {
  routes,
  stores,
  actions,
  autoruns,
  load(context, actions, autoruns) {
      console.log('has autoruns?', autoruns);
      console.log('where are my stores?');
      console.log(context.stores);
  }
};
```

## Containers definition

```
// client/imports/modules/core/containers/todos

import { connect } from 'mantrax';

import HomeTodos from '../components/todos.jsx';

const fromActionsToProps = (context, actions) => {

  // Container gets a subscription to DB here
  // that automatically syncs with a mobx store's value.
  // This is created using vladejs:tracker-mobx-autorun package

  const Collection = 'Todos';
  const subTo = 'todos.all';

  // subscription will save the Collection's data here
  const target = context.stores.core.todos;

  const subToOptions = {};
  const selector = {};
  const options = {};

  // context.autoruns.create is a Generic function that subscribes
  // to publications and has many params in order to avoid code duplication
  // see the implementation below
  const todosAutorun = context.autoruns.create(Collection, subTo, target, subToOptions, selector, options);

  return {
    // Dumb component will receive this
    goAbout: actions.routes.goAbout,

    // and this
    insertTodo: actions.todos.insertTodo,

    // but not this, because its needed only by the parent container (which starts and stops them automatically)
    autoruns: [ todosAutorun ]
  };
};

const fromStoresToProps = (stores, ownProps) => ({
  // Todos from MobX synced with publication via autorun.create
  todos: stores.core.todos.toJS(),

  // a computed function from the MobX store
  hasTodos: stores.core.hasTodos
});

export default connect(fromActionsToProps, fromStoresToProps)(HomeTodos);
```

// Generic MobX-Publication Subscriber
```
// client/imports/modules/core/autoruns/create.js
import autorun, { observe } from 'meteor/vladejs:tracker-mobx-autorun';

export default (
  { Meteor, Collections }, // the context object, passed automatically as first param
  CollectionName = 'Unknown', // mandatory
  subTo = 'todos.list', // mandatory
  target, // mandatory

  subToOptions,
  selector = {},
  options = {},
  findType = 'find' // findOne, find...
) => {
  const reactiveFn = () => {
    let handle;

    if (subToOptions) {
      handle = Meteor.subscribe(subTo, subToOptions);
    } else {
      handle = Meteor.subscribe(subTo);
    }

    const cursor = Collections[CollectionName][findType](selector, options);
    console.log(cursor.count(), handle.ready());
    observe(`${subTo}Autorun`, target, handle, cursor);
  };

  // MantraX gets this fn and apply .start(), .stop() methods for you
  return autorun(reactiveFn);
};
```

## Takeaways

* Minimal re-renders out of the box thanks to MobX.
* Automatic sync between MobX stores and Database data.
* `HomeTodos` component will get 4 props: 2 actions and 2 store's values.
* `todos` value is automatically filled from a Meteor subscription created on `autoruns` folder.
* The autoruns that you create on Containers are automatically started|stoped whenever the Component is Created|Destroyed
* The Dumb component `HomeTodos` doesn't know about `mobx-react` (doesn't need the @observer decorator).
* If you know connect API from Redux you know MantraX.

See CHANGELOG.md to see the list of changes.
Please feel free to report bugs/feedback/questions/[put your term here] related to Mantra Phoenix.
