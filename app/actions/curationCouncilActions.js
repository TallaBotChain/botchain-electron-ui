import CurationCouncil from '../blockchain/CurationCouncil';
import * as HistoryActions from '../actions/historyActions';
import * as BotcoinActions from '../actions/botcoinActions';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import {remote} from 'electron';
import keyTools from '../blockchain/KeyTools';

export const CurationCouncilActions = {
  SET_ATTRIBUTE: 'SET_CURATION_COUNCIL_ATTRIBUTE',
  RESET_STATE: 'CURATION_COUNCIL_RESET_STATE'
}

export const setError = (error) => {
  return { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setStakedBalance = (balance) => {
  return { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'stakedBalance', value: balance }
}

export const resetState = () => {
  return { type: CurationCouncilActions.RESET_STATE }
}

const setPendingTx = (hasPendingTx) => {
  return { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}

export const reloadStakedBalance = () => (dispatch) => {
  dispatch(setStakedBalance(0));
  dispatch(getStakedBalance());
}


export const getStakedBalance = () => (dispatch) => {
  dispatch(setInProgress(true))
  let curationCouncil = new CurationCouncil()
  // ethers
  curationCouncil.getStakedBalance().then((balance) => {
    dispatch(setStakedBalance(curationCouncil.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBalance(0))
    dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'error', value: "Failed to retrieve staked balance" })
    dispatch(setInProgress(false))
  });
}

export const getMinStake = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let minStake = await curationCouncil.getMinStake();
  let minStakeInTokens = curationCouncil.web3.utils.fromWei(minStake, 'ether');
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'minStake', value: minStake });
}

export const approveJoinPayment = (amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin();
    let chargingContract = remote.getGlobal('config').curation_council_contract;
    let txId = await botCoin.approve(amount, chargingContract);
    //create new history row
    let data = { value: amount, txId, input: "approving"}
    dispatch(HistoryActions.addNewTransaction('stake', data))
    dispatch(startTxObserver(txId, () => joinCouncil(amount, txId)));
    dispatch(setInProgress(false))
    dispatch(reset('stake'));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Not approved. Request cancelled." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

export const joinCouncilEstGas = (amount) => async (dispatch) => {
  try {
    let botCoin = new BotCoin();
    let chargingContract = remote.getGlobal('config').curation_council_contract;
    let approveGas = await botCoin.approveEstGas(amount, chargingContract);
    let curationCouncil = new CurationCouncil()
    let joinGas = await curationCouncil.joinCouncilEstGas(amount);
    let gasFee = curationCouncil.web3.utils.fromWei(((approveGas+joinGas)*curationCouncil.gasPrice).toString())
    dispatch( { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to Estimate Gas. "+ e ));
    dispatch(setInProgress(false))
  }
}

export const joinCouncil = (amount, approveTxId) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let curationCouncil = new CurationCouncil()
    let txId = await curationCouncil.joinCouncil(amount);
    dispatch(setInProgress(false))
    //create new history row
    let data = { value: amount, txId, input: curationCouncil.getMethodSignature("joinCouncil")}
    dispatch(HistoryActions.addNewTransaction('stake', data))
    dispatch(HistoryActions.removeTransaction('stake', approveTxId))

    dispatch(startTxObserver(txId, (status, receipt) => joinCouncilTxMined(txId, status, receipt, amount)));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to join Council." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

const joinCouncilTxMined = (txId, status, receipt, amount) => (dispatch) => {
  console.log("joinCouncilTxMined +", receipt)
  dispatch(setPendingTx(false))
  if(status == TxStatus.SUCCEED){
    dispatch(BotcoinActions.getBalance())
    dispatch(getStakedBalance())
  } else {
    dispatch( setError("Join Council transaction failed." ));
  }
  let curationCouncil = new CurationCouncil()
  //update history row
  let data = { value: amount, txId, input: curationCouncil.getMethodSignature("joinCouncil"), from: keyTools.address,  ...receipt}
  dispatch(HistoryActions.addNewTransaction('stake', data))
}

export const leaveCouncilEstGas = () => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let curationCouncil = new CurationCouncil()
    let leaveGas = await curationCouncil.leaveCouncilEstGas();
    let gasFee = curationCouncil.web3.utils.fromWei((leaveGas*curationCouncil.gasPrice).toString())
    dispatch( { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to estimate gas." ));
    dispatch(setInProgress(false))
  }
}

export const leaveCouncil = () => async (dispatch, getState) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  let curationCouncil = new CurationCouncil()
  try {
    let txId = await curationCouncil.leaveCouncil();
    let stakedBalance = getState().curationCouncil.stakedBalance
    //create new history row
    let data = {value: stakedBalance, txId, input: curationCouncil.getMethodSignature("leaveCouncil")}
    dispatch(HistoryActions.addNewTransaction('stake', data))
    dispatch(startTxObserver(txId, (status, receipt) => leaveCouncilTxMined(txId, status, receipt, stakedBalance)));
    dispatch(setInProgress(false))
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to leave Council." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(true))
  }
}

const leaveCouncilTxMined = (txId, status, receipt, amount) => (dispatch) => {
  console.log("leaveCouncilTxMined +", receipt)
  dispatch(setPendingTx(false))
  if(status == TxStatus.SUCCEED){
    dispatch(BotcoinActions.getBalance())
    dispatch(getStakedBalance())
  } else {
    dispatch( setError("Leave Council transaction failed." ));
  }

  //update history row
  let curationCouncil = new CurationCouncil()
  let data = {txId, value: amount, input: curationCouncil.getMethodSignature("leaveCouncil"), ...receipt}
  dispatch(HistoryActions.addNewTransaction('stake', data))
}
