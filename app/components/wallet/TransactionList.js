import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import keyTools from '../../blockchain/KeyTools';

export default class TransactionList extends Component {


  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Transaction</th>
            <th></th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {this.props.walletData.transactions.map(
            (tx, i) => (
              <tr key={i}>
                <td><a href={`${"https://kovan.etherscan.io"}/tx/${tx.hash}`} target='_blank'>{tx.hash.substring(0,20)}...</a></td>
                <td>{keyTools.address.toUpperCase() === tx.from.toUpperCase() ? "OUT" : "IN"}</td>
                <td>{keyTools.web3.utils.fromWei(tx.value)} {this.props.walletData.currency}</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    )
  }
}