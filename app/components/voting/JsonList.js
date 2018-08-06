import React, { Component } from 'react';

export default class JsonList extends Component {

  valueKeyToLabel(k) {
    return k.replace('_', ' ').toUpperCase();
  }

  render() {
    let body = Object.keys(this.props.data).filter((k)=>(this.props.data[k].toString() != "")).map( (k) => (
      <div key={k}>
        <dt className='text-left'>{this.valueKeyToLabel(k)}</dt>
        <dd className='text-left'>{this.props.data[k]}</dd>
      </div>
    ));
    return (
      <dl>
        {body}
      </dl>
      );
  }

}
