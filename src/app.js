import {
  injectDeps
} from 'react-simple-di';

export default class App {
  constructor(context) {
    if (!context) {
      const message = `Context is required when creating a new app.`;
      throw new Error(message);
    }

    this.context = context;
    this.actions = {};
    this.autoruns = {};
    this._routeFns = [];
  }

  _bindContext(_actions) {
    const actions = {};
    for (let key in _actions) {
      if (_actions.hasOwnProperty(key)) {
        const actionMap = _actions[key];
        const newActionMap = {};
        for (let actionName in actionMap) {
          if (actionMap.hasOwnProperty(actionName)) {
            newActionMap[actionName] =
              actionMap[actionName].bind(null, this.context);
          }
        }
        actions[key] = newActionMap;
      }
    }

    return actions;
  }

  _bindAutorunsContext(_autoruns) {
    const autoruns = {};

    for (let key in _autoruns) {
      if (_autoruns.hasOwnProperty(key)) {
        autoruns[key] = _autoruns[key].bind(null, this.context);
      }
    }

    return autoruns;
  }

  loadModule(module) {
    this._checkForInit();

    if (!module) {
      const message = `Should provide a module to load.`;
      throw new Error(message);
    }

    if (module.__loaded) {
      const message = `This module is already loaded.`;
      throw new Error(message);
    }

    if (module.routes) {
      if (typeof module.routes !== 'function') {
        const message = `Module's routes field should be a function.`;
        throw new Error(message);
      }

      this._routeFns.push(module.routes);
    }

    const actions = module.actions || {};
    this.actions = {
      ...this.actions,
      ...actions
    };

    const autoruns = module.autoruns || {};

    const allAutoruns = {
      ...this.autoruns,
      ...autoruns
    };

    /*
     * This module has no access to the actions/autoruns
     * loaded after this module.
     */
    const boundedActions = this._bindContext(this.actions);
    const boundedAutoruns = this._bindAutorunsContext(allAutoruns);

    this.context.autoruns = boundedAutoruns;

    if (module.load) {
      if (typeof module.load !== 'function') {
        const message = `module.load should be a function`;
        throw new Error(message);
      }

      module.load(this.context, boundedActions, boundedAutoruns);
    }

    module.__loaded = true;
  }

  init() {
    this._checkForInit();

    for (const routeFn of this._routeFns) {
      const inject = comp => {
        return injectDeps(this.context, this.actions)(comp);
      };

      // allow route fns to use defined autoruns
      routeFn(inject, this.context, this.actions, this.autoruns);
    }

    this._routeFns = [];
    this.__initialized = true;
  }

  _checkForInit() {
    if (this.__initialized) {
      const message = `App is already initialized`;
      throw new Error(message);
    }
  }
}
