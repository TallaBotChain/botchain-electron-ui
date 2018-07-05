import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class TransactionList extends Component {


  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {this.props.ethereum.transactions.map(
            (tx, i) => (
              <tr key={i}>
                <td><a href={`${"https://kovan.etherscan.io"}/tx/${tx.tx_id}`} target='_blank'>{tx.tx_id.substring(0,20)}...</a></td>
                <td>{tx.direction} {tx.value} ETH</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    )
  }
}