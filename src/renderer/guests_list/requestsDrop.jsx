/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import api from 'renderer/api/api';
import DropDown from '../hive_elements/dropDown';
import RollingList from '../hive_elements/rolling_list';

function RequestsDrop(props) {
  const tags = api.tags.useData();
  const add_request = api.requestsBelongs.useCreate();

  function createItems() {
    if (tags.data) {
      const tags_array = Object.entries(tags.data);
      const items = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [key, tag] of tags_array) {
        items.push({ name: tag.name, value: tag.id });
      }
      return items;
    }
  }

  function onItem(item) {
    const data = {
      guest_id: props.selected,
      tag_id: item.value,
    };
    add_request(data).then(() => {
      props.setPos(null);
      props.setSelected(null);
    });
  }

  return (
    <DropDown pos={props.pos}>
      <RollingList items={createItems()} onItemClick={onItem} />
    </DropDown>
  );
}

export default RequestsDrop;
