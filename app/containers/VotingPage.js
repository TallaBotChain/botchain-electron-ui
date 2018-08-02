// @flow
import React, { Component } from 'react';
import { Col } from 'react-bootstrap'
import Balances from '../components/voting/Balances';
import NoStake from '../components/voting/NoStake';
import VoteList from '../components/voting/VoteList';
import * as VotingActions from '../actions/votingActions';
import * as DeveloperActions from '../actions/developerActions';
import * as CurationCouncilActions from '../actions/curationCouncilActions';
import { connect } from 'react-redux';

class VotingPage extends Component {

  componentDidMount() {
    this.props.getStakedBalance();
    this.props.getBalances();
    this.props.getVotes();
  }

  renderNoStake() {
    return (<NoStake />)
  }

  renderInProgress() {
    return (<div className='text-center'>Loading...</div>)
  }

  renderVoting = () => {
    return (
      <div>
      <Balances {...this.props.voting} payout={this.props.payout} />
      <VoteList votes={this.props.voting.votes} {...this.props} />
      </div>
    )
  }

  render() {
    let body = ""
    if (this.props.voting.inProgress) {
      body = this.renderInProgress()
    } else if (this.props.curationCouncil.stakedBalance > 0) {
      body = this.renderVoting()
    }else {
      body = this.renderNoStake()
    }
    return (
      <Col xs={12} className="content-inner white-bg">
        {body}
      </Col>
    )
  }
}

function mapStateToProps(state) {
    return {
      voting: state.voting,
      developer: state.developer,
      curationCouncil: state.curationCouncil
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalances: () => {
      dispatch( VotingActions.getRewardBalance() );
    },
    getStakedBalance: () => {
      dispatch(CurationCouncilActions.getStakedBalance());
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
