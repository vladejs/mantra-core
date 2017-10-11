import React, { Component } from 'react';

export default DumbComponent => class extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.processAutoruns();
  }

  componentWillUnmount() {
    this.processAutoruns('stop');
  }

  processAutoruns(action = 'start') {
    const { autoruns } = this.props;
    if (autoruns && autoruns.length && autoruns.length > 0) {
      for (const auto of autoruns) {
        if (auto && typeof auto[action] === 'function') auto[action]();
      }
    }
  }

  render() {
    const props = Object.assign({}, this.props);
    if (props.autoruns) {
      delete props.autoruns;
    }
    return <DumbComponent {...props} />;
  }
}
