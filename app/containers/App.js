// @flow
import * as React from 'react';
import AppNav from '../components/shared/AppNav';
import {Grid, Row, Col } from 'react-bootstrap'

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <Grid fluid={true}>
        <Row className="show-grid">
          <Col xs={3} md={2} id="navigation">
            <AppNav />
          </Col>
          <Col xs={8} md={10} id="content">
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}
