/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import api from 'renderer/api/api';
import './requests_count.css';

function RequestBox({ request_id, tag_id }) {
  const tags = api.tags.useData();
  const delete_request = api.requestsBelongs.useDelete();

  function onClickDelete() {
    delete_request({ request_id });
  }

  if (tags.data) {
    return (
      <div className="request-box" dir="rtl">
        <span className="delete" onClick={onClickDelete}>
          x
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
      value.forEach(({ id, request }, index) =>
        requests_list.push(
          <RequestBox request_id={id} tag_id={request} key={index} />
        )
      );
    }
    return requests_list;
  }

  return <div className="requests-count">{renderRequestsList()}</div>;
}

export default RequestsCount;
