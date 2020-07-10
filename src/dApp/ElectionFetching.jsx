import * as React from 'react';
import { Card, Spinner } from 'react-bootstrap';

// TODO: Move title to the constants
export default function ElectionFetching() {
  return (
    <Card className="text-center">
      <Card.Header as="h5">Connecting to the blockchain</Card.Header>
      <Card.Body>
        <Spinner animation="border" />
      </Card.Body>
    </Card>
  );
}
