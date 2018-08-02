// @flow
import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import PayoutModal from './PayoutModal';
import { Link } from 'react-router-dom';

class NoStake extends Component {

  render() {
    return (
      <div>
        <h4>Participating in Curation Council voting requires a stake.</h4>
        <p>Your stake can be any amount greater than zero. 
          However, the greater the stake the more you'll be able to vote. 
          To read more about staking and voting, please refer to <a href="#">this article</a>.
          Click the button below to go directly to the Stake screen to submit your first stake.
        </p>
        <Link to="/stake" className="btn orange-button cta-button">SUBMIT STAKE</Link>
      </div>
    );
  }
}

export default NoStake;
