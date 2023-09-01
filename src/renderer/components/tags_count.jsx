/* eslint-disable import/no-cycle */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */

import { useParams } from 'react-router-dom';
import api from 'renderer/api/api';

function getColor(backColor) {
  if (backColor) {
    let color = 'black';
    const c = backColor.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    if (luma < 160) {
      color = 'white';
    }
    return color;
  }
}

function TagsCount({ value }) {
  const { map_name } = useParams();
  const tags = api.tags.useData();
  if (value) {
    if (tags.data) {
      let i = 0;
      return (
        <div className="tags_cont">
          {' '}
          {value.map((tag_id) => {
            const tag = tags.data[tag_id.tag];
            if (!tag) return;
            if (map_name) {
              if (map_name === tag.name) return;
            }
            const color = getColor(tag.color);
            const style = {
              backgroundColor: tag.color,
              color,
            };
            i++;
            return (
              <div key={i} style={style} className="tag_box">
                {tag.name}
              </div>
            );
          })}{' '}
        </div>
      );
    }
  }
}

export default TagsCount;
