import React, { Component } from 'react';
import { Button, Row, Col, Well, Alert } from 'react-bootstrap';
import JsonList from './JsonList';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

const STATUS_NO_VOTE = 0;
const STATUS_VOTED_PENDING = 1;
const STATUS_VOTED_MINED = 2;

export default class VoteDetails extends Component {

  developer = () => {
    return this.props.voting.voteToShow ? this.props.developer.records[this.props.voting.voteToShow.address] : null
  }

  timeRemaining = (vote) => {
    if( vote && (! vote.expired) ) {
      const ethereumBlocktime = this.props.voting.ethereumBlocktime;
      let duration = ethereumBlocktime*(vote.finalBlock - this.props.voting.lastBlock);
      return moment.duration(duration, "seconds").format(this.timespanTemplate, {trim: false});
    }
    return "expired";
  }

  timespanTemplate() {
    return this.duration.asSeconds() >= 86400 ? "d [DAYS]" : "h [HOURS]";
  }

  dateSubmitted = (vote) => {
    if( vote ) {
      return moment.unix(vote.initialTs).format("MMMM Do, YYYY");
    }
    return "N/A";
  }

  get currentVoteKey() {
    return this.props.voting.voteToShow ? this.props.voting.voteToShow.key : null;
  }

  get currentPastVote() {
    if ( this.currentVoteKey && this.props.voting.pastVotes[this.currentVoteKey] ) {
      return  this.props.voting.pastVotes[this.currentVoteKey];
    }
    return null;
  }

  approveVote = () => {
    this.props.castVote(this.currentVoteKey, true);
  }

  rejectVote = () => {
    this.props.castVote(this.currentVoteKey, false);
  }

  votedStatus = () => {
    if( this.currentPastVote ) {
      return this.currentPastVote.mined ? STATUS_VOTED_MINED : STATUS_VOTED_PENDING;
    }
    return STATUS_NO_VOTE;
  }

  castedVote = () => {
    if( this.currentPastVote ) {
      return this.currentPastVote.voted ? "approved" : "rejected";
    }
    return "";
  }

  castedDate = () => {
    if( this.currentPastVote ) {
      return moment.unix(this.currentPastVote.timestamp).format("MMMM Do YYYY");
    }
    return "";
  }

  renderHeader = () => {
    switch( this.votedStatus() ) {
      case STATUS_VOTED_PENDING: {
        return this.renderHeaderPending();
      }
      case STATUS_VOTED_MINED: {
        return this.renderHeaderMined();
      }
      default: {
        return this.renderHeaderRegular();
      }
    }
  }

  renderHeaderRegular = () => {
    return (
      <Row>
      <Col xs={3}>
        <Button block onClick={this.approveVote}>Approve</Button>
      </Col>
      <Col xs={3}>
        {this.props.voting.voteToShow ? this.props.voting.voteToShow.reward : ""} <abbr className='currency'>BOTC</abbr><br />
        Gas Fee: {this.props.voting.voteTxEstGas}
      </Col>
      <Col xs={3}>
        $0.00<br />
        ${this.props.voting.voteTxEstGas*this.props.usdExchangeRate}
      </Col>
      <Col xs={3}>
        <Button block onClick={this.rejectVote}>Reject</Button>
      </Col>
    </Row>
    );
  }

  etherscanLink = (txId) => {
    return (
      <a href={`${"https://kovan.etherscan.io"}/tx/${txId}`} target='_blank'>{txId}</a>
    );
  }

  renderHeaderMined = () => {
    return (
      <Row>
        <Col xs={12}>
          This application was <b>{this.castedVote()}</b> on {this.castedDate()}. More details are available on the Etherscan transaction details page:<br/>
          {this.etherscanLink(this.currentPastVote.txId)}
        </Col>
      </Row>
    );
  }

  renderHeaderPending = () => {
    return (
      <Row>
        <Col xs={12}>
          This application is <b>pending</b>. Your vote was cast on {this.castedDate()}.
          More details are available on the Etherscan transaction details page:<br/>
          {this.etherscanLink(this.currentPastVote.txId)}
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className="vote-details">
        {this.renderHeader()}
        <Row>
          <Col xs={6}>
            <dl>
              <dt>TIME REMAINING</dt>
              <dd>{this.timeRemaining(this.props.voting.voteToShow)}</dd>
            </dl>
          </Col>
          <Col xs={6}>
            <dl>
              <dt>DATE SUBMITTED</dt>
              <dd>{this.dateSubmitted(this.props.voting.voteToShow)}</dd>
            </dl>
          </Col>
        </Row>
        {this.developer() ? <JsonList data={this.developer().metadata} /> : "" }
      </div>
      );
}
}
