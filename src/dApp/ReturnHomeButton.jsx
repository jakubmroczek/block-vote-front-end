import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function ReturnHomeButton() {
  return (
    <LinkContainer to="/">
      <Button variant="outline-success">
        Home
      </Button>
    </LinkContainer>
  );
}
