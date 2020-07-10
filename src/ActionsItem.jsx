import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './fontawesome.js';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function renderEditTooltip(props) {
  return (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  );
}

function renderRemoveTooltip(props) {
  return (
    <Tooltip id="button-tooltip" {...props}>
      Remove
    </Tooltip>
  );
}

export default function ActionsItem({ handleEdit, handleRemove }) {
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250 }}
        overlay={renderEditTooltip}
      >
        <Button onClick={handleEdit} variant="secondary">
          <FontAwesomeIcon icon={faPen} />
        </Button>
      </OverlayTrigger>
      {' '}
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={renderRemoveTooltip}
      >
        <Button onClick={handleRemove} variant="secondary">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </OverlayTrigger>
    </>
  );
}
