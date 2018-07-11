// @flow
import React, { Component } from 'react';
import Voting from '../components/Voting';
import Balances from '../components/voting/Balances';
import VoteList from '../components/voting/VoteList';
import * as VotingActions from '../actions/votingActions';
import { connect } from 'react-redux';

class VotingPage extends Component {

  componentDidMount() {
    this.props.getBalances();
  }

  render() {
    let votes = [
      {name: "Vote 1", reward: 0.25},
      {name: "Vote 2", reward: 0.35},
      {name: "Vote 3", reward: 0.45},
      {name: "Vote 4", reward: 0.55},
      {name: "Vote 5", reward: 0.15},
      {name: "Vote 6", reward: 0.05}
    ];
    return (
      <div>
        <h1>Voting</h1>
        <Balances {...this.props.voting} />
        <VoteList votes={votes}  />
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      voting: state.voting,
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalances: () => {
      dispatch( VotingActions.getRewardBalance() );
      dispatch( VotingActions.getAvailableReward() );
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(VotingPage);
