import React from 'react';
import {
  Button, Figure, Container, Row, Col,
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

export default function WelcomePage() {
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
          </Col>
        </Row>
      </Container>
    </>
  );
}
