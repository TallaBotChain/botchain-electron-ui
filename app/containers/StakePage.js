// @flow
import React, { Component } from 'react';
import WalletBotcoin from '../components/wallet/WalletBotcoin';
import * as HistoryActions from '../actions/historyActions';
import * as BotcoinActions from '../actions/botcoinActions';
import * as EthereumActions from '../actions/ethereumActions';
import * as CurationCouncilActions from '../actions/curationCouncilActions';
import Stake from '../components/stake/Stake'
import { connect } from 'react-redux';

class StakePage extends Component {

  componentDidMount() {
    this.props.getMinStake()
    this.props.getBalance()
    this.props.getStakedBalance()
    this.props.getTransactionList()
  }

  render() {
    return (
      <Stake {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  return {
    walletData: state.botcoin,
    ethBalance: state.ethereum.balance,
    history: state.history,
    usdExchangeRate: state.ethereum.usdExchangeRate,
    curationCouncil: state.curationCouncil
  };
}

const mapDispatchToProps = dispatch => {
  return {
    stakeEstGas: (amount) => {
      dispatch(CurationCouncilActions.joinCouncilEstGas(amount));
    },
    stake: (amount) => {
      dispatch(CurationCouncilActions.approveJoinPayment(amount));
    },
    unstakeEstGas: () => {
      dispatch(CurationCouncilActions.leaveCouncilEstGas());
    },
    unstake: () => {
      dispatch(CurationCouncilActions.leaveCouncil());
    },
    getBalance: () => {
      dispatch(BotcoinActions.getBalance());
      dispatch(EthereumActions.getBalance());
    },
    getStakedBalance: () => {
      dispatch(CurationCouncilActions.getStakedBalance());
    },
    getTransactionList: () => {
      dispatch(HistoryActions.getStakeHistory());
    },
    getMinStake: () => {
      dispatch(CurationCouncilActions.getMinStake());
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(StakePage);
