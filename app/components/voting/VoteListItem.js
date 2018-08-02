import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
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
    if( vote.expired ) {
      result = ( this.props.voting.pastVotes[vote.key] ) ? "Approved" : "Rejected";
      className += " " + result.toLowerCase();
    } else {
      const ethereumBlocktime = 15; // 15 seconds on average
      className = "status-future";
      let duration = ethereumBlocktime*(vote.finalBlock - this.props.voting.lastBlock) ;
      if( duration > 5*86400 ) {
        className += " grey";
      }else if (duration > 86400) {
        className += " yellow";
      }else {
        className += " red";
      }
      result = "EXPIRES " + moment.duration(duration, "seconds").format(this.statusTemplate, {trim: false});
    }
    return <span className={className}>{result}</span>;
  }

  statusTemplate() {
    return this.duration.asSeconds() >= 86400 ? "d [D]" : "h [H]";
  }

  render() {
    let vote = this.props.vote;
    return (
      <ListGroupItem title={vote.address} className='clearfix' onClick={this.props.voteClick(vote)}>
        <Col xs={6} md={3}>{this.voteStatus(vote)}</Col>
        <Col xs={6} md={3}>{this.props.developer.records[vote.address] ? this.props.developer.records[vote.address].metadata.name : "Loading..."  }</Col>
        <Col xs={6} md={3}>{this.voteDomain(vote)}</Col>
        <Col xs={6} md={3}>{vote.reward} <abbr className='currency'>BOTC</abbr></Col>
      </ListGroupItem>);
  }

}
