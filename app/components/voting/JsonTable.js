import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class JsonTable extends Component {

  render() {
    let body = Object.keys(this.props.data).map( (k) => (
      <tr key={k}>
        <th className='text-left'>{k}</th>
        <td className='text-left'>{this.props.data[k]}</td>
      </tr>
    )) ;
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </Table>
      );
  }

}
