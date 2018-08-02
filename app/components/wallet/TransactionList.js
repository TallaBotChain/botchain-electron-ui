import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import keyTools from '../../blockchain/KeyTools';
import moment from "moment";

export default class TransactionList extends Component {


  render() {
    return (
      <Table hover responsive className="transaction-table text-left gray-text">
        <tbody>
          {this.props.walletData.transactions.map(
            (tx, i) => (
              <tr key={i}>
                <td>
                  <span className="state-text">{keyTools.address.toUpperCase() === tx.from.toUpperCase() ? "SENT" : "RECEIVED"} {keyTools.web3.utils.fromWei(tx.value)} {this.props.walletData.currency}</span> on {moment(tx.timeStamp * 1000).format("MMM Do YYYY")}<br />
                  <span className="gray"><a href={`${"https://kovan.etherscan.io"}/tx/${tx.hash}`} target='_blank'>{tx.hash.substring(0, 40)}</a></span>
                </td>
                <td className="text-right">
                  <span className="state-text">({keyTools.web3.utils.fromWei(tx.value)} <span className={this.props.walletData.currency === "ETH" ? "ethereum" : "botcoin"}>{this.props.walletData.currency}</span>)</span><br />
                  <span className="dollar-text">${keyTools.web3.utils.fromWei(tx.value) * this.props.walletData.usdExchangeRate}</span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    )
  }
}
