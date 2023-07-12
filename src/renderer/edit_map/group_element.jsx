/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-plusplus */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelection } from 'hive-select';
import { ActionsContext, EditContext } from '../app';
import '../style/elements.css';

function GroupElement({ cell }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edit, setEdit] = useContext(EditContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [action, setAction] = useContext(ActionsContext);
  const Pref = useRef(null);
  const [Cstyle, setCstyle] = useState({});
  const selection = useSelection();

  const [initPointerPos, setInitPointerPos] = useState({ x: 0, y: 0 });
  const [PrectState, setPrect] = useState();
  const [size, setSize] = useState();
  const [right, setRight] = useState(0);
  const [top, setTop] = useState(0);

  function MouseMoveXRight(event) {
    if (initPointerPos.x != 0) {
      const new_size = { ...size };
      new_size.width = PrectState.width + event.clientX - initPointerPos.x;
      setSize(new_size);
    }
  }
  function MouseMoveXLeft(event) {
    if (initPointerPos.x != 0) {
      const new_size = { ...size };
      new_size.width = PrectState.width - (event.clientX - initPointerPos.x);
      setSize(new_size);
    }
  }
  function MouseMoveYTop(event) {
    if (initPointerPos.y != 0) {
      const new_size = { ...size };
      new_size.height = PrectState.height - (event.clientY - initPointerPos.y);
      setSize(new_size);
    }
  }
  function MouseMoveYBottom(event) {
    if (initPointerPos.y != 0) {
      const new_size = { ...size };
      new_size.height = PrectState.height + (event.clientY - initPointerPos.y);
      setSize(new_size);
    }
  }
  function MouseUp() {
    document.removeEventListener('mousemove', MouseMoveXRight);
    document.removeEventListener('mousemove', MouseMoveXLeft);
    document.removeEventListener('mousemove', MouseMoveYTop);
    document.removeEventListener('mousemove', MouseMoveYBottom);
    document.removeEventListener('mouseup', MouseUp);
    selection?.enable();
  }

  useEffect(() => {
    if (action === 'groups' && edit == 'ערוך') {
      const Prect = Pref.current.getBoundingClientRect();
      setPrect(Prect);
      if (Prect.height > Prect.width) setCstyle({ transform: 'rotate(90deg)' });
    }
  }, [action, edit]);

  useEffect(() => {
    setSize({ height: PrectState?.height, width: PrectState?.width - 6 });
  }, [PrectState]);

  cell.from_row = Number(cell.from_row);
  cell.from_col = Number(cell.from_col);
  cell.to_row = Number(cell.to_row);
  cell.to_col = Number(cell.to_col);

  let { from_row, from_col, to_row, to_col } = cell;

  to_row++;
  to_col++;

  if (edit == 'ערוך') {
    from_row++;
    from_col++;
    to_row++;
    to_col++;
  }

  useEffect(() => console.log(right), [right]);

  function onMouseOver(event) {
    setInitPointerPos({ x: event.clientX, y: event.clientY });
  }

  function onClickScaleXLeft() {
    setRight('0');
    document.addEventListener('mousemove', MouseMoveXLeft);
    document.addEventListener('mouseup', MouseUp);
    selection?.disable();
  }

  function onClickScaleXRight() {
    setRight('100');
    document.addEventListener('mousemove', MouseMoveXRight);
    document.addEventListener('mouseup', MouseUp);
    selection?.disable();
  }
  function onClickScaleYTop() {
    setTop('0');
    document.addEventListener('mousemove', MouseMoveYTop);
    document.addEventListener('mouseup', MouseUp);
    selection?.disable();
  }

  function onClickScaleYBottom() {
    setTop('100');
    document.addEventListener('mousemove', MouseMoveYBottom);
    document.addEventListener('mouseup', MouseUp);
    selection?.disable();
  }

  if (action === 'groups' && edit == 'ערוך') {
    return (
      <div
        className="group-element-cont"
        ref={Pref}
        style={{
          gridRowStart: from_row,
          gridColumnStart: from_col,
          gridRowEnd: to_row,
          gridColumnEnd: to_col,
        }}
      >
        <div
          className={`group-element ${
            action === 'groups' && edit == 'ערוך' ? 'selectable' : ''
          }`}
          group_id={cell.id}
          style={{
            height: `${size?.height}px`,
            width: `${size?.width}px `,
            '--right-value': right,
            '--top-value': top,
            '--group-element-height': `${size?.height}px`,
            '--group-element-width': `${size?.width}px`,
          }}
        >
          <div
            className="resizer left"
            onMouseOver={onMouseOver}
            onMouseDown={onClickScaleXLeft}
          />
          <div
            className="resizer right"
            onMouseOver={onMouseOver}
            onMouseDown={onClickScaleXRight}
          />
          <div
            className="resizer top"
            onMouseOver={onMouseOver}
            onMouseDown={onClickScaleYTop}
          />
          <div
            className="resizer bottom"
            onMouseOver={onMouseOver}
            onMouseDown={onClickScaleYBottom}
          />
          <div style={Cstyle}>{cell.name}</div>
        </div>
      </div>
    );
  }
}

export default GroupElement;
