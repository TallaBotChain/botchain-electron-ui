import CurationCouncil from '../blockchain/CurationCouncil';
import {remote} from 'electron';
import axios from 'axios'
import keyTools from '../blockchain/KeyTools';

export const HistoryActions = {
  SET_ATTRIBUTE: 'SET_HISTORY_ATTRIBUTE',
  ADD_TRANSACTIONS: 'HISTORY_ADD_TRANSACTIONS',
  ADD_TO_INDEX: 'HISTORY_ADD_TO_INDEX',
  REMOVE_FROM_INDEX: 'HISTORY_REMOVE_FROM_INDEX'
}

/** Returns params for Etherscan API call */
const defaultAccountApiParams = () => {
  return {
    module: "account",
    address: keyTools.address,
    sort: "desc",
    apikey: remote.getGlobal('config').etherscan_api_key
  }
}

/** Transforms format of transactions array
 * @param transactions - list of transactions
 **/
const normalizeTransactions = (transactions) => {
  let result = { index: [], transactions: {}}
  transactions.map((transaction) => {
    result.index.push(transaction.hash)
    result.transactions[transaction.hash] = transaction
  })
  return result
}


/** Sets error
 * @param error - error string or array
 **/
const setError = (error) => {
  return { type: HistoryActions.SET_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: HistoryActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Adds new transaction to history
 * @param type - transaction type
 * @param data - transaction data
 **/
export const addNewTransaction = (type, data) => (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let newTx = {
    [data.txId]: {
      hash: data.txId,
      from: data.from || "0x",
      timeStamp: Math.floor(Date.now() /1000),
      gasPrice: "100000000",
      gasUsed: data.gasUsed,
      blockNumber: data.blockNumber,
      value: curationCouncil.web3.utils.toWei(data.value.toString(), "ether"),
      input: data.input
    }
  }
  dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: newTx });
  dispatch({ type: HistoryActions.ADD_TO_INDEX, key: type, value: [data.txId] });
}

/** Removes transaction from index
 * @param type - transaction type
 * @param txId - transaction hash
 **/
export const removeTransaction = (type, txId) => (dispatch) => {
  dispatch({ type: HistoryActions.REMOVE_FROM_INDEX, key: type, value: txId });
}

/** Retrieves history of joinCouncil/leaveCouncil transactions */
export const getStakeHistory = () => (dispatch, getState) => {
  dispatch(setInProgress(true))
  let startblock = getState().history.stakeBlockId
  axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      ...defaultAccountApiParams(),
      startblock: parseInt(startblock)+1,
      action: "tokentx",
      contractaddress: remote.getGlobal('config').botcoin_contract,
    }
  })
  .then(function (response) {
    //filter by stake/unstake method signatures
    if (response.data.result){
      let curationCouncil = new CurationCouncil();
      const stakeMethod = curationCouncil.getMethodSignature("joinCouncil");
      const unstakeMethod = curationCouncil.getMethodSignature("leaveCouncil");
      let data =  response.data.result.filter(record => (record.input.startsWith(stakeMethod) || record.input.startsWith(unstakeMethod)))
      if (data.length > 0) {
        let {index, transactions} = normalizeTransactions(data)
        dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: transactions });
        dispatch({ type: HistoryActions.ADD_TO_INDEX, key: 'stake', value: index });
        dispatch({ type: HistoryActions.SET_ATTRIBUTE, key: 'stakeBlockId', value: data[0].blockNumber})
      }
    }
    dispatch(setInProgress(false))
  })
  .catch(function (error) {
    console.log(error)
    dispatch( setError("Failed to retreive transaction history." ));
    dispatch(setInProgress(false))
  })
}

/** Retrieves history of Ether transfers */
export const getEthereumHistory = () => (dispatch, getState) => {
  dispatch(setInProgress(true))
  let startblock = getState().history.ethereumBlockId
  axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      ...defaultAccountApiParams(),
      startblock: parseInt(startblock)+1,
      action: "txlist"
    }
  })
  .then(function (response) {
    //filter by eth amount.
    if (response.data.result && response.data.result.length > 0){
      let data =  response.data.result.filter(record => record.value > 0)
      if (data.length > 0) {
        let {index, transactions} = normalizeTransactions(data)
        dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: transactions });
        dispatch({ type: HistoryActions.ADD_TO_INDEX, key: 'ethereum', value: index });
        dispatch({ type: HistoryActions.SET_ATTRIBUTE, key: 'ethereumBlockId', value: data[0].blockNumber})
      }
    }
    dispatch(setInProgress(false))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
    dispatch(setInProgress(false))
  })
}

/** Retrieves history of BOT (ERC20) transfers */
export const getBotcoinHistory = () => (dispatch, getState) => {
  dispatch(setInProgress(true))
  let startblock = getState().history.botcoinBlockId
  axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      ...defaultAccountApiParams(),
      action: "tokentx",
      startblock: parseInt(startblock)+1,
      contractaddress: remote.getGlobal('config').botcoin_contract,
    }
  })
  .then(function (response) {
    if (response.data.result && response.data.result.length > 0){
      let data = response.data.result
      let {index, transactions} = normalizeTransactions(data)
      dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: transactions });
      dispatch({ type: HistoryActions.ADD_TO_INDEX, key: 'botcoin', value: index });
      dispatch({ type: HistoryActions.SET_ATTRIBUTE, key: 'botcoinBlockId', value: data[0].blockNumber})
    }
    dispatch(setInProgress(false))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
    dispatch(setInProgress(false))
  })
}
