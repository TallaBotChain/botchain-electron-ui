import React, { Component } from 'react';

export default (props) => {
  let networkName= props.network;
  const translations = { "kovan" : "Kovan Test Network",
                         "mainnet" : "Mainnet Ethereum Network" }
  return <div className={'network '+networkName} title="You can change network in Settings"><span className='circle'></span> {translations[networkName]}</div>
}
