import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import keyTools from '../../blockchain/KeyTools';

export default class TransactionList extends Component {


  render() {
    return (
      <Table hover responsive className="transaction-table text-left gray-text">
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
          {/* <tr>
            <td>
              <span className="state-text">SENT 0.200 ETH</span> on May 4, 2018<br/>
              <span className="gray">0xd0d705E2D93d666B9eCF0a67AE977D5E8451a2B2</span>
            </td>
            <td>
              <span className="state-text">(0.200 <span className="ethereum">ETH</span>)</span><br/>
              <span className="dollar-text">$94.10 USD</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="state-text">sent 0.185 ETH</span> on February 2, 2018<br/>
              <span className="gray">0xd0d705E2D950208f3o0385kf898377D5E8451a2B1</span>
            </td>
            <td>
              <span className="state-text">(0.185 <span className="ethereum">ETH</span>)</span><br/>
              <span className="dollar-text">$87.47 USD</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="state-text">RECEIVED 1.000 ETH</span> on January 30, 2018<br/>
              <span className="gray">0xd0d705E2D950208f3o0385kf8983sd0949f90K0p3</span>
            </td>
            <td>
              <span className="state-text">(1.000 <span className="botcoin">BOTC</span>)</span><br/>
              <span className="dollar-text">$470.51 USD</span>
            </td>
          </tr> */}
        </tbody>
      </Table>
    )
  }
}
