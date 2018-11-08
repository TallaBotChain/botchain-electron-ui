import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';
import * as HistoryActions from '../actions/historyActions';

export const EthereumActions = {
  SET_ETHEREUM_ATTRIBUTE: 'SET_ETHEREUM_ATTRIBUTE',
  RESET_STATE: 'ETHEREUM_RESET_STATE'
}

/** Sets error
 * @param error - error string or array
 **/
export const setError = (error) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets current account balance in Ether
 * @param balance - amount of Ether
 **/
const setBalance = (balance) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'balance', value: balance }
}

/** Sets array of transactions
 * @param transactions - array of transaction objects
 **/
const setTransactions = (transactions) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transactions', value: transactions }
}

/** Resets redux state for Ethereum wallet storage */
export const resetState = () => {
  return { type: EthereumActions.RESET_STATE }
}

/** Sets boolean flag if there is a pending transation
 * @param hasPendingTx - true if pending transaction is present
 **/
const setPendingTx = (hasPendingTx) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}


/** Retrieves Ether balance from blockchain and converts from Wei to ETH */
export const getBalance = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  botCoin.getBalance().then((balance) => {
    dispatch(setBalance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(getExchangeRate())
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBalance(0))
    dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: "Failed to retrieve balance" })
    dispatch(setInProgress(false))
  });
}

/** Estimates gas fee for Ether transfer
 * @param to - recepient address
 * @param amount - amount of Ether to transfer
 **/
export const transferEstGas = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let botCoin = new BotCoin()
    let transferGas = await botCoin.transferEtherEstGas(to, amount);
    let gasFee = botCoin.web3.utils.fromWei((transferGas*botCoin.gasPrice).toString())
    dispatch( { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to estimate gas." ));
    dispatch(setInProgress(false))
  }
}

/** Transfers ETH
 * @param to - recepient address
 * @param amount - amount of Ether to transfer
 **/
export const transfer = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin()
    let txId = await botCoin.transferEther(to, amount);
    dispatch(startTxObserver(txId, (status, receipt) => transferTxMined(txId, status, receipt, amount)));
    dispatch(reset('eth_transfer'));
    dispatch(setInProgress(false))
    //create new history row
    let data = { value: amount, txId, input: "0x", from: keyTools.address}
    dispatch(HistoryActions.addNewTransaction('ethereum', data))

  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

/** Process miden transfer transaction
 * @param txId - transaction id (hash)
 * @param status - transaction status
 * @param receipt - transaction receipt
 * @param amount - transfer amount
 **/
const transferTxMined = (txId, status, receipt, amount) => (dispatch) => {
  dispatch(setPendingTx(false))
  if(status == TxStatus.SUCCEED){
    dispatch(getBalance())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }
  //update history row
  let data = { value: amount, txId, input: "0x", from: keyTools.address, ...receipt}
  dispatch(HistoryActions.addNewTransaction('ethereum', data))
}

/** Retrieves ETH/USD exchange rate from Coinbase */
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
