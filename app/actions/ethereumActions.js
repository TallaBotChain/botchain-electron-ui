import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';

export const EthereumActions = {
  SET_ETHEREUM_ATTRIBUTE: 'SET_ETHEREUM_ATTRIBUTE',
  RESET_STATE: 'ETHEREUM_RESET_STATE'
}

export const setError = (error) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'balance', value: ballance }
}

const setTransactions = (transactions) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transactions', value: transactions }
}

export const resetState = () => {
  return { type: EthereumActions.RESET_STATE }
}

export const resetTransferState = () => (dispatch) => {
  dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxMined', value: false });
  dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxId', value: null });
  dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferSuccess', value: false });
  dispatch(setError(null))
}


export const getBalance = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getBalance().then((balance) => {
    dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(getExchangeRate())
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBallance(0))
    dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: "Failed to retrieve balance" })
    dispatch(setInProgress(false))
  });
}



export const transfer = (to, amount) => async (dispatch) => {
  dispatch(resetTransferState())
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  try {
    let txId = await botCoin.transferEther(to, amount);
    dispatch( { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxId', value: txId });
    dispatch(startTxObserver(txId, transferTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
  }
}

const transferTxMined = (status) => (dispatch) => {
  dispatch(setInProgress(false))
  dispatch(reset('eth_transfer'));
  dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferSuccess', value: true });
    dispatch(getBalance())
    dispatch(getTransactionList())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }
}

export const getTransactionList = () => (dispatch) => {
  axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      module: "account",
      action: "txlist",
      address: keyTools.address,
      sort: "desc",
      apikey: remote.getGlobal('config').etherscan_api_key
    }
  })
  .then(function (response) {
    dispatch(setTransactions(response.data.result))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
  })
}

export const getExchangeRate = () => (dispatch) => {
  axios.get(remote.getGlobal('config').coinbase_price_api_url)
    .then(function (response) {
      dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'usdExchangeRate', value: response.data.data.amount });
    })
    .catch(function (error) {
      dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'usdExchangeRate', value: 0 });
      console.log("Failed to retreive ETH - USD exchange rate." + error)
    })
}
