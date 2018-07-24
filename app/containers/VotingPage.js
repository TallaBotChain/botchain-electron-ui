// @flow
import React, { Component } from 'react';
import Balances from '../components/voting/Balances';
import VoteList from '../components/voting/VoteList';
import * as VotingActions from '../actions/votingActions';
import * as DeveloperActions from '../actions/developerActions';
import { connect } from 'react-redux';

class VotingPage extends Component {

  componentDidMount() {
    this.props.getBalances();
    this.props.getVotes();
  }

  render() {
    return (
      <div>
        <h1>Voting</h1>
        <Balances {...this.props.voting} payout={this.props.payout} />
        {this.props.voting.inProgress ? <div className='text-center'>Loading...</div> : "" }
        <VoteList votes={this.props.voting.votes} {...this.props}  />
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      voting: state.voting,
      developer: state.developer
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalances: () => {
      dispatch( VotingActions.getRewardBalance() );
    },
    getVotes: () => {
      dispatch( VotingActions.getVotes() );
    },
    resetVoteState: () => {
      dispatch( VotingActions.resetVoteState() );
    },
    getDeveloperInfo: (address) => {
      dispatch( DeveloperActions.getDeveloperInfo(address) );
    },
    showVote: (vote) => {
      dispatch( VotingActions.showVote(vote) );
    },
    hideVote: () => {
      dispatch( VotingActions.hideVote() );
    },
    castVote: (idx, vote) => {
      dispatch( VotingActions.castVote(idx, vote) );
    },
    payout: () => {
      dispatch( VotingActions.payoutReward() );
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(VotingPage);
