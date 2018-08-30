import CurationCouncil from '../../blockchain/CurationCouncil';
import BotCoin from '../../blockchain/BotCoin';
import TokenVault from '../../blockchain/TokenVault';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import keyTools from '../../blockchain/KeyTools';
import moment from "moment";
import {round} from '../../utils/Rounder'

export default class TransactionList extends Component {

  constructor(props) {
    super(props);
    let botCoin = new BotCoin()
    let curationCouncil = new CurationCouncil();
    let tokenVault = new TokenVault();
    this.methods = {
      "approving": "APPROVING",
      "0x": "TRANSFER",
      [curationCouncil.getMethodSignature("joinCouncil")]: "STAKE",
      [curationCouncil.getMethodSignature("leaveCouncil")]: "UNSTAKE",
      [tokenVault.getMethodSignature("collectCuratorReward")]: "CURATOR REWARD",
      [botCoin.getMethodSignature("transfer")]: "TRANSFER"
     };
  }

  isTxMine = (address) => {
    return keyTools.address.toUpperCase() === address.toUpperCase()
  }

  isTxPending = (tx) => {
    return !tx.blockNumber
  }

  renderLabel = (tx) => {
    let label = this.methods[tx.input.substring(0, 10)] || "UNKNOWN"

    if (label == "TRANSFER"){
      label = this.isTxMine(tx.from) ? "SENT" : "RECEIVED"
    }

    if (this.isTxPending(tx)){
      label = `${label}(PENDING)`
    }

    return (
      <div>
        <span className="state-text">{label} {keyTools.web3.utils.fromWei(tx.value)} {this.props.currency}</span> on {moment(tx.timeStamp * 1000).format("MMM Do YYYY")}
      </div>
    )
  }

  renderGasFee = (tx) => {
    if (this.isTxMine(tx.from) && !this.isTxPending(tx)) {
      return (
        <div>
          <span className="gray">gas fee: </span><span className="dollar-text">${round(keyTools.web3.utils.fromWei((tx.gasPrice * tx.gasUsed).toString()) * this.props.usdExchangeRate)}</span>
        </div>
      )
    }
  }

  renderUsdAmount = (tx) => {
    if (this.props.currency === "ETH" && !this.isTxPending(tx)) {
      return (<span className="dollar-text">${round(keyTools.web3.utils.fromWei(tx.value) * this.props.usdExchangeRate)}</span>)
    }
  }

  render() {
    return (
      <Table hover responsive className="transaction-table text-left gray-text">
        <tbody>
          {this.props.transactions.map(
            (tx, i) => (
              <tr key={i} style={this.isTxPending(tx) ? {background: "#FFFCE5"} : {}}>
                <td>
                  {this.renderLabel(tx)}<br />
                  <span className="gray"><a href={`${"https://kovan.etherscan.io"}/tx/${tx.hash}`} target='_blank'>{tx.hash.substring(0, 40)}</a></span>
                  {this.renderGasFee(tx)}
                </td>
                <td className="text-right">
                  <span className="state-text">{keyTools.web3.utils.fromWei(tx.value)} <span className={this.props.currency === "ETH" ? "ethereum" : "botcoin"}>{this.props.currency}</span></span><br />
                  {this.renderUsdAmount(tx)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    )
  }
}
