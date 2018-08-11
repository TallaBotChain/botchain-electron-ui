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
    let className = "status-expired";
    let time_remaining = "EXPIRED";
    if( vote && (! vote.expired) ) {
      const ethereumBlocktime = this.props.voting.ethereumBlocktime;
      let duration = ethereumBlocktime*(vote.finalBlock - this.props.voting.lastBlock);
      if( duration > 5*86400 ) {
        className = "gray-text";
      }else if (duration > 86400) {
        className = "yellow";
      }else {
        className = "orange";
      }
      time_remaining = moment.duration(duration, "seconds").format(this.timespanTemplate, {trim: false});
    }
    return <dd className={className}><small>{time_remaining}</small></dd>;
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
      <div className="vote-details-header">
        <Col sm={3} xs={12}>
          <Button className="green-button small-button" onClick={this.approveVote}>APPROVE</Button>
        </Col>
        <Col sm={6} xs={12}>
          <small className="state-text">{this.props.voting.voteToShow ? this.props.voting.voteToShow.reward : ""} <small className='botcoin-title'>BOTC</small></small><br />
          <small className="gray-text">Gas Fee: {this.props.voting.voteTxEstGas}</small>
        </Col>
        <Col xs={3}>
          $0.00<br />
          ${this.props.voting.voteTxEstGas*this.props.usdExchangeRate}
        </Col>
        <Col sm={3} xs={12} className="text-right">
          <Button className="reject-button small-button" onClick={this.rejectVote}><span></span>REJECT</Button>
        </Col>
      </div>
    );
  }

  etherscanLink = (txId) => {
    return (
      <a href={`${"https://kovan.etherscan.io"}/tx/${txId}`} target='_blank' className="dollar-text">{txId}</a>
    );
  }

  renderHeaderMined = () => {
    return (
      <div className="vote-details-header">
        <Col xs={12}>
          <div className={this.castedVote()+" text-center fake-button active-green"}>{this.castedVote()}</div>
        </Col>
        <Col xs={12}>
          <Col xs={12} className="divider"></Col>
        </Col>
        <Col xs={12}>
          <small>
            This application was <b>{this.castedVote()}</b> on {this.castedDate()}. More details are available on the Etherscan transaction details page:
          </small>
          {this.etherscanLink(this.currentPastVote.txId)}
        </Col>
      </div>
    );
  }

  renderHeaderPending = () => {
    return (
      <div className="vote-details-header">
        <Col xs={12}>
          <div className="pending text-center fake-button active-green">Pending</div>
        </Col>
        <Col xs={12}>
          <Col xs={12} className="divider"></Col>
        </Col>
        <Col xs={12}>
          <small>
            This application is <b>pending</b>. Your vote was cast on {this.castedDate()}.
            More details are available on the Etherscan transaction details page:
          </small>
          {this.etherscanLink(this.currentPastVote.txId)}
        </Col>
      </div>
    );
  }

  render() {
    return (
      <Col xs={8} className="vote-details state-text">
        {this.renderHeader()}
        <Col xs={12}>
          <Col xs={12} className="divider"></Col>
        </Col>
        <Col xs={6}>
          <dl>
            <dt className="gray">TIME REMAINING</dt>
            {this.timeRemaining(this.props.voting.voteToShow)}
          </dl>
        </Col>
        <Col xs={6} className="text-right">
          <dl>
            <dt className="gray">DATE SUBMITTED</dt>
            <dd className="state-text">{this.dateSubmitted(this.props.voting.voteToShow)}</dd>
          </dl>
        </Col>
        {this.developer() ? <JsonList data={this.developer().metadata} /> : "" }
      </Col>
    );
  }
}
