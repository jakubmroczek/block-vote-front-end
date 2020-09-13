import React from 'react';
import {
  Form, Button, Container, Row, Col,
} from 'react-bootstrap';
import graphQLFetch from '../graphQLFetch.js';

export default function RegisterPublicKeyPanel(props) {
  const { match: { params: { electionID } } } = props;

  const register = async (secretToken, publicKey) => {
    const query = `mutation 
        registerPublicKey($id: ID!, $secretToken: SecretToken!, $publicKey: PublicKey!) {
            registerPublicKey(id: $id, secretToken: $secretToken, publicKey: $publicKey) 
    }`;

    const id = electionID;
    const response = await graphQLFetch(query, { id, secretToken, publicKey });

    if (response) {
      alert('Yours public key was successfully registered.')
    } else {
      alert('Provided secret token is invalid.')
    }
  };

  const isValidPublicKey = () => {
    const form = document.forms.registerPublicKey;
    const publicKey = form.publicKey.value;
    const regex = RegExp('^0x[a-fA-F0-9]{40}$');
    return regex.test(publicKey);
  };


  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isValidPublicKey()) {
      alert('Public key is illformatted');
      return;
    }

    const form = document.forms.registerPublicKey;
    const credentials = {
      secretToken: form.secretToken.value,
      publicKey: form.publicKey.value,
    };

    const { secretToken, publicKey } = credentials;

    await register(secretToken, publicKey);
  };

  const onHomeClick = () => {
    const { history } = props;
    history.push('/');
  };

  return (
    <Container className="mt-3">
      <Row className="mt-3">
        <Col>
          <Form name="registerPublicKey">
            <Form.Group controlId="secretToken">
              <Form.Label>Secret token</Form.Label>
              <Form.Control type="text" placeholder="Enter secret token" />
              <Form.Text className="text-muted">
                Secret token that was send in the mail.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="publicKey">
              <Form.Label>Public key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Ethereum public keys"
              />
              <Form.Text className="text-muted">
                Ethereum public key.
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3 text-center">
        <Col>
          <Button variant="outline-success" type="submit" onClick={onSubmit}>
            Submit
          </Button>
          {' '}
          <Button variant="outline-success" type="submit" onClick={onHomeClick}>
            Home
          </Button>
        </Col>
      </Row>
    </Container>


  );
}
