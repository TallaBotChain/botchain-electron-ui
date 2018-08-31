// @flow
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap'
import NoStake from '../components/voting/NoStake';
import Voting from '../components/voting/Voting';
import * as VotingActions from '../actions/votingActions';
import * as DeveloperActions from '../actions/developerActions';
import * as CurationCouncilActions from '../actions/curationCouncilActions';
import { connect } from 'react-redux';
import loading from 'img/loading.gif';

class VotingPage extends Component {

  componentDidMount() {
    this.props.getStakedBalance();
    this.props.getBalances();
  }

  componentWillReceiveProps(nextProps){
    if(( this.props.curationCouncil.stakedBalance != nextProps.curationCouncil.stakedBalance ) && ( nextProps.curationCouncil.stakedBalance > 0 ) ) {
      this.props.getVotes();
    }
  }

  renderNoStake() {
    return (<NoStake />)
  }

  renderInProgress() {
    return (<div className='text-center loading'><img src={loading} alt="Loading..." /></div>)
  }

  renderVoting = () => {
    return (<Voting {...this.props} />);
  }

  render() {
    let body = ""
    if (this.props.curationCouncil.inProgress) {
      body = this.renderInProgress()
    } else if (this.props.curationCouncil.stakedBalance > 0) {
      body = this.renderVoting()
    } else {
      body = this.renderNoStake()
    }
    return (
      <Col xs={12} className="content-inner white-bg no-top-padding">
        <Row>
          <Col xs={12} className="content-inner light-gray-bg not-cover-footer">
            {body}
          </Col>
        </Row>
      </Col>
    )
  }
}

function mapStateToProps(state) {
    return {
      voting: state.voting,
      developer: state.developer,
      curationCouncil: state.curationCouncil,
      ethBalance: state.ethereum.balance,
      usdExchangeRate: state.ethereum.usdExchangeRate
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalances: () => {
      dispatch( VotingActions.getRewardBalance() );
    },
    getStakedBalance: () => {
      dispatch(CurationCouncilActions.reloadStakedBalance());
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
    castVoteEstGas: (idx, vote) => {
      dispatch( VotingActions.castVoteEstGas(idx, vote) );
    },
    castVote: (idx, vote) => {
      dispatch( VotingActions.castVote(idx, vote) );
    },
    payoutEstGas: () => {
      dispatch( VotingActions.payoutRewardEstGas() );
    },
    payout: () => {
      dispatch( VotingActions.payoutReward() );
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(VotingPage);
