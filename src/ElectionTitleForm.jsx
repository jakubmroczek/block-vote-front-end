import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Card, OverlayTrigger, Tooltip, Modal,
} from 'react-bootstrap';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CommonModal({ placeholder, modalTitle, show, onHide, onSubmit }) {
  
  const [newTitle, setNewTitle ] = useState('');
  
  const onClick = (event) => {
    event.preventDefault();
    onHide();

    const form = document.forms.title;
    const title = form.titleControl.value;

    onSubmit(title);
  };

  return (
    <React.Fragment>
      <Modal
        keyboard
        show={show}
        onHide={onHide}
        style={{ opacity: 1 }}
        centered
      >
        <Modal.Header closeButton>
          {/* TODO: edit is also possible */}
      <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form name="title">
            <FormGroup>
              <Form.Label>Title:</Form.Label>
              <Form.Control name="titleControl" placeholder={placeholder} value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            onClick={onClick}
            variant="outline-success"
          >
            Submit
          </Button>
          {' '}
          <Button onClick={onHide} variant="outline-dark">Cancel</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

function AddTitleModal({ show, onHide, onSubmit  }) {
  const modalTitle = 'Add a title' ;
  const placeholder = '';

  return (
    <CommonModal 
      placeholder={placeholder}
      modalTitle={modalTitle} 
      show={show}
      onHide={onHide}
      onSubmit={onSubmit}  />
  );
}

function EditTitleModal({ placeholder, show, onHide, onSubmit  }) {
  const modalTitle = 'Edit the title';

  return (
    <CommonModal 
      placeholder={placeholder}
      modalTitle={modalTitle} 
      show={show}
      onHide={onHide}
      onSubmit={onSubmit} />
  );
}

export default class ElectionTitleForm extends React.Component {
  constructor(props) {
    super(props);
    const { title } = this.props;
    this.state = {
      title,
      modalVisible: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.update = this.update.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { title } = this.props;
    if (title !== prevProps.title) {
      this.setState({ title });
    }
  }

  onChange(event) {
    this.setState({ title: event.target.value });
  }

  async update(title) {
    const changes = { title };
    const { update } = this.props;
    update(changes);
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  async onSubmit(title) {
    this.setState({ title });
    await this.update(title);
  }

  render() {
    const { title } = this.state;

    const isTitleEmpty = (title === '');

    const renderEditTooltip = props => (
      <Tooltip id="button-tooltip" {...props}>
        Edit
      </Tooltip>
    );

    const renderAddTooltip = props => (
      <Tooltip id="button-tooltip" {...props}>
        Add
      </Tooltip>
    );

    const { modalVisible } = this.state;

    if (isTitleEmpty) {
      return (
        <Card className="text-center mt-2 mr-3">
          <Card.Header as="h5">Title</Card.Header>
          <Card.Body>
            {/* TODO: Create a reusable component */}
            <OverlayTrigger
              placement="top"
              delay={{ show: 250 }}
              overlay={renderAddTooltip}
            >
              {/* Wyswietl modal */}
              <Button onClick={this.showModal} variant="secondary">
                {' '}
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </OverlayTrigger>
          </Card.Body>
          <AddTitleModal placeholder={title} show={modalVisible} onHide={this.hideModal} onSubmit={this.onSubmit} />
        </Card>
      );
    }
    return (
      <Card className="text-center mt-2 mr-3">
        <Card.Header as="h5">Title</Card.Header>
        <Card.Body>
          <Form name="electionTitle">
            <FormGroup>
              <Form.Control
                name="title"
                autoFocus
                value={title}
                readOnly
              />
            </FormGroup>
          </Form>

          <OverlayTrigger
            placement="top"
            delay={{ show: 250 }}
            overlay={renderEditTooltip}
          >
            <Button onClick={this.showModal} variant="secondary">
              <FontAwesomeIcon icon={faPen} />
            </Button>
          </OverlayTrigger>
        </Card.Body>
        <EditTitleModal placeholder={title} show={modalVisible} onHide={this.hideModal} onSubmit={this.onSubmit} />
      </Card>
    );
  }
}
