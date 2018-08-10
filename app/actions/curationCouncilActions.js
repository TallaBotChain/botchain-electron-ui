import CurationCouncil from '../blockchain/CurationCouncil';
import * as BotcoinActions from '../actions/botcoinActions';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import {remote} from 'electron';

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

export const resetJoinState = () => (dispatch) => {
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxMined', value: false });
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxId', value: null });
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinSuccess', value: false });
  dispatch(setError(null))
}

export const resetLeaveState = () => (dispatch) => {
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveTxMined', value: false });
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveTxId', value: null });
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveSuccess', value: false });
  dispatch(setError(null))
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

export const approveJoinPayment = (amount) => async (dispatch) => {
  dispatch(resetJoinState())
  let botCoin = new BotCoin();
  let chargingContract = remote.getGlobal('config').curation_council_contract;
  console.log("Approving for amount ", amount);

  try {
    let txId = await botCoin.approve(amount, chargingContract);
    dispatch( { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxId', value: txId });
    dispatch(startTxObserver(txId, () => joinCouncil(amount)));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Not approved. Request cancelled." ));
    dispatch(setInProgress(false))
  }
}

export const joinCouncilEstGas = (amount) => async (dispatch) => {
  dispatch(resetJoinState())
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

export const joinCouncil = (amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let curationCouncil = new CurationCouncil()
    let txId = await curationCouncil.joinCouncil(amount);
    dispatch( { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxId', value: txId });
    dispatch(startTxObserver(txId, joinCouncilTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to join Council." ));
    dispatch(setInProgress(false))
  }
}

const joinCouncilTxMined = (status) => (dispatch) => {
  dispatch(setInProgress(false))
  dispatch(reset('stake'));
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'joinSuccess', value: true });
    dispatch(BotcoinActions.getBalance())
    dispatch(getStakedBalance())
  } else {
    dispatch( setError("Join Council transaction failed." ));
  }
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

export const leaveCouncil = () => async (dispatch) => {
  dispatch(resetLeaveState())
  dispatch(setInProgress(true))
  let curationCouncil = new CurationCouncil()
  try {
    let txId = await curationCouncil.leaveCouncil();
    dispatch( { type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveTxId', value: txId });
    dispatch(startTxObserver(txId, leaveCouncilTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to leave Council." ));
    dispatch(setInProgress(false))
  }
}

const leaveCouncilTxMined = (status) => (dispatch) => {
  dispatch(setInProgress(false))
  dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch({ type: CurationCouncilActions.SET_ATTRIBUTE, key: 'leaveSuccess', value: true });
    dispatch(BotcoinActions.getBalance())
    dispatch(getStakedBalance())
  } else {
    dispatch( setError("Leave Council transaction failed." ));
  }
}
