import DeveloperRegistry from '../blockchain/DeveloperRegistry';
import axios from 'axios'

export const DeveloperActions = {
  SET_ATTRIBUTE: 'SET_DEVELOPER_ATTRIBUTE',
  SET_DEVELOPER_ATTRIBUTE: 'SET_DEVELOPER_HASH_ATTRIBUTE',
  APPEND: "APPEND_DEVELOPER",
  RESET_STATE: 'DEVELOPER_RESET_STATE'
}

/** Set error
 * @param error - error string or array
 **/
const setError = (error) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'error', value: error }
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets developer attribute
 * @param address - developer address in ethereum network
 * @param key - attribute key
 * @param value - atttribute value
 **/
const setDeveloperAttribute = (address, key, value) => {
  return { type: DeveloperActions.SET_DEVELOPER_ATTRIBUTE, address: address, key: key, value: value }
}

/** Appends developer record to the storage
 * @param developer - object with information about developer
 **/
const appendDeveloper = (developer) => {
  return { type: DeveloperActions.APPEND, developer }
}

/** Retrieves developer info location from blockchain and downloads metadata from IPFS
 * @param address - developer address
 **/
export const getDeveloperInfo = (address) => async (dispatch, getStore) => {
  dispatch(setInProgress(true));
  let developerRegistry = new DeveloperRegistry();
  try {
    let id = await developerRegistry.getDeveloperId(address)
    let url = await developerRegistry.getDeveloperUrl(id)
    let metadata = await getDeveloperMetadata(url)
    let developer = { [address]: { developerId: id, url: url, metadata: metadata} }
    dispatch(appendDeveloper(developer))
  } catch (e) {
    console.log(e);
    dispatch(setError("Failed to retreive developer info."));
  }
  dispatch(setInProgress(false));
}

/** Downloads developer metadata from URL
 * @param url - url of metadata file in JSON format
 **/
const getDeveloperMetadata = (url) => {
  return new Promise((resolve, reject) => {
    if( url == "" ) resolve({ error: "No metadata found"});
    axios.get(url)
      .then((response) => resolve(response.data))
      .catch((error) => resolve({ error: "Unable to retrieve metadata"}))
  });
}
