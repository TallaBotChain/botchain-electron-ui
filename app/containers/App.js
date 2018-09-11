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

  renderMacTitleBar = () => {
    if (process.platform === 'darwin') {
      return (
        <div className="title-bar text-center">Botchain Curation Council</div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderMacTitleBar()}
        <Grid fluid={true} className={process.platform === 'darwin' ? "container-state container-mac" : "container-state"}>
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
      </div>
    )
  }
}
