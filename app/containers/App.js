// @flow
import * as React from 'react';
import AppNav from '../components/shared/AppNav';
import Footer from '../components/shared/Footer';
import {Grid, Row, Col } from 'react-bootstrap'

// localStorage.removeItem('botcoin');

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <Grid fluid={true} className="container-state">
        <div className="sidenav">
          <AppNav />
        </div>
        <Grid fluid={true} className="content-container">
          <Row id="content">
            {this.props.children}
          </Row>
          <Footer />
        </Grid>
      </Grid>
    )
  }
}
