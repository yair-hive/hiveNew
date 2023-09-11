/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import api from 'renderer/api/api';
import './requests_count.css';
import { useState } from 'react';

export function RequestBox({ request_id, tag_id }) {
  const tags = api.tags.useData();
  const [active, setActive] = useState(true);
  const delete_request = api.requestsBelongs.useDelete();

  function onClickDelete() {
    setActive(false);
    delete_request({ request_id });
  }

  if (tags.data) {
    return (
      <div
        className="request-box"
        dir="rtl"
        style={{
          backgroundColor: `${request_id === 'temp' || !active ? 'gray' : ''}`,
        }}
      >
        <span
          className="delete"
          onClick={onClickDelete}
          style={{
            cursor: 'pointer',
          }}
        >
          &#10005;
        </span>
        <span className="text"> {tags.data[tag_id].name} </span>
      </div>
    );
  }
}

function RequestsCount({ value }) {
  function renderRequestsList() {
    const requests_list = [];
    if (value) {
      value.forEach(({ id, request }, index) => {
        const key = id !== 'temp' ? id : index;
        requests_list.push(
          <RequestBox request_id={id} tag_id={request} key={key} />
        );
      });
    }
    return requests_list;
  }

  return <div className="requests-count">{renderRequestsList()}</div>;
}

export default RequestsCount;
