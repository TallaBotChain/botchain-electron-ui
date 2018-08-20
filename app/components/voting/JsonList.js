import React, { Component } from 'react';
import {Col} from 'react-bootstrap';

export default class JsonList extends Component {

  valueKeyToLabel(k) {
    return k.replace('_', ' ').toUpperCase();
  }

  render() {
    let body = Object.keys(this.props.data).filter((k)=>(this.props.data[k].toString() != "")).map( (k) => (
      <div key={k}>
        <dt className='text-left gray'>{this.valueKeyToLabel(k)}</dt>
        <dd className='text-left state-text'>{this.props.data[k]}</dd>
      </div>
    ));
    return (
      <Col xs={12}>
        {body}
      </Col>
      );
  }

}
