# Change Log

### v2.0.6


### v2.0.4, v2.0.5
Replace react-simple-di for nqm-react-simple-di

### v2.0.3
Add complete examples to README file

### v2.0.2
* Added actions to context object in order to allow triggering actions from actions
```
export default {
  saveTodo: ({ Meteor, FlowRouter, actions }, param1, param2) => {
    Meteor.call('todos.save', param1, function(error, id){
      actions.notifyUsers(id, param2);
    });
  },

  notifyUsers: ({ Collections, stores, actions }, id, param2) => {
    ...
  }
};
```

* Autoruns should now be returned on containers so they are automatically stopped when the container
gets destroyed. See README.md for implementation details.

### v2.0.1
* Automatically register the module's stores into the context object
* All module's autoruns are correctly available to all modules (like actions)

### v2.0.0
* Update mantra-core to use MobX 3.x and Meteor 1.5+
* Renamed the package to MantraX
* Removed React-komposer 1.x
* Added mobdux (thin wrapper for mobx-react wich avoids you tu @observe all your dumb components)

### v1.7.0

* Update react-storybook to v1.9.0 to support stubbing.

### v1.6.1
01-May-2016

* Fix action bounding issue with module.load
### v1.6.0
01-May-2016

* Add actions to module.load()

### v1.5.0
09-April-2016

* Updated deps to support React v15.x.x

### v1.4.0
30-March-2016

* Update react-komposer to v1.7.0

### v1.3.0
16-March-2016

* Add support for React Native. This is basically by updating dependencies.

### v1.2.0
* Make module.load() optional.

### v1.1.0

* Update react-komposer to 1.3.0.
* Use react to use 0.14.6 or higher

### v1.0.0

* Initial release
