import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, Row } from 'react-bootstrap';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export default class VoteListItem extends Component {

  constructor(props) {
    super(props);
  }

  voteDomain = (vote) => {
    let url = this.props.developer.records[vote.address] ? this.props.developer.records[vote.address].metadata.url : false;
    try {
      return url ? (new URL(url)).hostname : "--";
    }catch(ex) {
      console.log(ex);
      return "--";
    }
  }

  voteStatus = (vote) => {
    let result = "N/A";
    let className = "status-expired";
    if( vote.expired || this.props.voting.pastVotes[vote.key] ) {
      result = ( this.props.voting.pastVotes[vote.key].voted ) ? "Approved" : "Rejected";
      className += " " + result.toLowerCase();
    } else {
      className = "status-future";
      const ethereumBlocktime = this.props.voting.ethereumBlocktime;
      let duration = ethereumBlocktime*(vote.finalBlock - this.props.voting.lastBlock) ;
      if( duration > 5*86400 ) {
        className += " gray-text";
      }else if (duration > 86400) {
        className += " yellow";
      }else {
        className += " orange";
      }
      result = "EXPIRES " + moment.duration(duration, "seconds").format(this.statusTemplate, {trim: false});
    }
    return <span className={className}>{result}</span>;
  }

  voteStatusBrief = (vote) => {
    let className = "bot-name";
    if( this.props.voting.pastVotes[vote.key] ) {
      className += (this.props.voting.pastVotes[vote.key].voted) ? " green" : " red"
    } else {
      className += " state-text"
    }
    return className;
  }

  statusTemplate() {
    return this.duration.asSeconds() >= 86400 ? "d [D]" : "h [H]";
  }

  renderFullRow(vote){
    return (
      <div>
        <Row className="text-left">
          <Col xs={2}>{this.voteStatus(vote)}</Col>
          <Col xs={5}>{this.renderBriefRow(vote)}</Col>
          <Col xs={5} className={((vote.expired || this.props.voting.pastVotes[vote.key]) ? "gray" : "state-text") + " reward text-right"} >{vote.reward} <span className='botcoin-title'>BOTC</span></Col>
        </Row>
      </div>
    );
  }

  renderBriefRow(vote) {
    return (
      <div className={this.voteStatusBrief(vote)}>
        <span className="status"></span>
        {this.props.developer.records[vote.address] ? this.props.developer.records[vote.address].metadata.name : "Loading..."  } <small>{this.voteDomain(vote)}</small>
      </div>
    );
  }

  render() {
    let vote = this.props.vote;
    let className = "clearfix";
    if(this.props.voting.voteToShow){
      if(vote.key === this.props.voting.voteToShow.key) {
        className += " active"
      }
    }

    return (
      <ListGroupItem title={vote.address} className={className} onClick={this.props.voteClick(vote)}>
        {this.props.voting.voteToShow ? this.renderBriefRow(vote) : this.renderFullRow(vote) }
        <span className="inner-radius"></span>
      </ListGroupItem>);
  }

}
