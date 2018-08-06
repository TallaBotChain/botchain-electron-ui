// @flow
import React, { Component } from 'react';
import { Col } from 'react-bootstrap'
import NoStake from '../components/voting/NoStake';
import Voting from '../components/voting/Voting';
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
    return (<Voting {...this.props} />);
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
