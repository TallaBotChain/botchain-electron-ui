export const SharedActions = {
  RESET_APP: 'RESET_APP'
}

/** Resets redux state for entire app */
export const resetApp = () => {
  return { type: SharedActions.RESET_APP}
}

