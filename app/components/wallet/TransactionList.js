import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import keyTools from '../../blockchain/KeyTools';
import moment from "moment";

export default class TransactionList extends Component {

  isTxMine = (address) => {
    return keyTools.address.toUpperCase() === address.toUpperCase()
  } 

  label = (address) => {
    return this.isTxMine(address) ? (this.props.isStakeList ? "STAKE" : "SENT") : (this.props.isStakeList ? "UNSTAKE" : "RECEIVED")
  }

  render() {
    return (
      <Table hover responsive className="transaction-table text-left gray-text">
        <tbody>
          {this.props.transactions.map(
            (tx, i) => (
              <tr key={i}>
                <td>
                  <span className="state-text">{this.label(tx.from)} {keyTools.web3.utils.fromWei(tx.value)} {this.props.currency}</span> on {moment(tx.timeStamp * 1000).format("MMM Do YYYY")}<br />
                  <span className="gray"><a href={`${"https://kovan.etherscan.io"}/tx/${tx.hash}`} target='_blank'>{tx.hash.substring(0, 40)}</a></span>
                  {this.isTxMine(tx.from) && <div><span className="gray">gas fee: </span><span className="dollar-text">${(keyTools.web3.utils.fromWei((tx.gasPrice * tx.gasUsed).toString()) * this.props.usdExchangeRate).toFixed(3)}</span></div>}
                </td>
                <td className="text-right">
                  <span className="state-text">({keyTools.web3.utils.fromWei(tx.value)} <span className={this.props.currency === "ETH" ? "ethereum" : "botcoin"}>{this.props.currency}</span>)</span><br />
                  {this.props.currency === "ETH" && <span className="dollar-text">${(keyTools.web3.utils.fromWei(tx.value) * this.props.usdExchangeRate).toFixed(2)}</span> }
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    )
  }
}
