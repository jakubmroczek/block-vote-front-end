import React from 'react';
import {
  Button, Figure, Container, Row, Col, Modal,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Logo() {
  return (
    <Figure>
      <Figure.Image
        width={171}
        height={180}
        alt="BlockVote.logo"
        src="/logo.svg"
      />
    </Figure>
  );
}

function AboutPopUp({ visible, hide }) {
  return (
    <Modal centered keyboard show={visible} style={{ opacity: 1 }} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Lorem ipsum ipsum ipsum
      </Modal.Body>
    </Modal>
  );
}

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAboutModalVisible: false,
    };
    this.showAboutPopUp = this.showAboutPopUp.bind(this);
    this.hideAboutPopUp = this.hideAboutPopUp.bind(this);
  }

  showAboutPopUp() {
    this.setState({ isAboutModalVisible: true });
  }

  hideAboutPopUp() {
    this.setState({ isAboutModalVisible: false });
  }

  render() {
    const { isAboutModalVisible } = this.state;
    return (
      <>
        <Container className="mt-3 text-center">
          <Row>
            <Col>
              <Logo />
            </Col>
          </Row>
          <Row>
            <Col style={{ fontSize: 20 }}>
              Your truly decentralized voting
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <LinkContainer to="/vote">
                <Button variant="outline-success">
                  Vote
                </Button>
              </LinkContainer>
              <Button className="ml-1" variant="outline-info" onClick={this.showAboutPopUp}>
                About
              </Button>
            </Col>
          </Row>
        </Container>
        <AboutPopUp visible={isAboutModalVisible} hide={this.hideAboutPopUp} />
      </>
    );
  }
}
