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
import api from 'renderer/api/api';
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
  const [size, setSize] = useState();
  const [right, setRight] = useState(0);
  const [top, setTop] = useState(0);
  const [fromRow, setFromRow] = useState(0);
  const [toRow, setToRow] = useState(0);
  const [fromCol, setFromCol] = useState(0);
  const [toCol, setToCol] = useState(0);
  const updateGroup = api.seatsGroups.useUpdate();

  useEffect(() => {
    if (action === 'groups' && edit == 'ערוך') {
      const Prect = Pref.current.getBoundingClientRect();
      if (Prect.height > Prect.width) setCstyle({ transform: 'rotate(90deg)' });
      else setCstyle({ transform: 'rotate(0deg)' });
    }
  }, [action, edit, size]);

  useEffect(() => {
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
    setFromRow(from_row);
    setFromCol(from_col);
    setToRow(to_row);
    setToCol(to_col);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, edit]);

  useEffect(() => {
    if (Pref.current) {
      const Prect = Pref.current.getBoundingClientRect();
      setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
    }
  }, [fromRow, fromCol, toRow, toCol, action]);

  function MouseMoveXRight(event) {
    const Prect = Pref.current.getBoundingClientRect();
    if (initPointerPos.x != 0) {
      const new_size = { ...size };
      new_size.width = Prect.width + event.clientX - initPointerPos.x;
      setSize(new_size);
    }
  }
  function MouseMoveXLeft(event) {
    const Prect = Pref.current.getBoundingClientRect();
    if (initPointerPos.x != 0) {
      const new_size = { ...size };
      new_size.width = Prect.width - (event.clientX - initPointerPos.x);
      setSize(new_size);
    }
  }
  function MouseMoveYTop(event) {
    const Prect = Pref.current.getBoundingClientRect();
    if (initPointerPos.y != 0) {
      const new_size = { ...size };
      new_size.height = Prect.height - (event.clientY - initPointerPos.y);
      setSize(new_size);
    }
  }
  function MouseMoveYBottom(event) {
    const Prect = Pref.current.getBoundingClientRect();
    if (initPointerPos.y != 0) {
      const new_size = { ...size };
      new_size.height = Prect.height + (event.clientY - initPointerPos.y);
      setSize(new_size);
    }
  }

  function MouseUpYTop(event) {
    let ini = initPointerPos.y;
    let from_row = fromRow;
    if (event.clientY > ini) {
      if (event.clientY < ini + 40) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientY > ini + 40) {
        ini += 40;
        from_row += 1;
      }
    }
    if (event.clientY < ini) {
      if (event.clientY < ini - 40) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientY < ini - 40) {
        ini -= 40;
        from_row -= 1;
      }
    }
    setFromRow(from_row);
    updateGroup.from_row({ group_id: cell.id, value: from_row - 1 });
    document.removeEventListener('mouseup', MouseUpYTop);
  }
  function MouseUpYBottom(event) {
    let ini = initPointerPos.y;
    let to_row = toRow;
    if (event.clientY > ini) {
      if (event.clientY < ini + 40) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientY > ini + 40) {
        ini += 40;
        to_row += 1;
      }
    }
    if (event.clientY < ini) {
      if (event.clientY < ini - 40) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientY < ini - 40) {
        ini -= 40;
        to_row -= 1;
      }
    }
    setToRow(to_row);
    updateGroup.to_row({ group_id: cell.id, value: to_row - 2 });
    document.removeEventListener('mouseup', MouseUpYBottom);
  }
  function MouseUpXRight(event) {
    let ini = initPointerPos.x;
    let to_col = toCol;
    if (event.clientX > ini) {
      if (event.clientX < ini + 100) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientX > ini + 100) {
        ini += 100;
        to_col += 1;
      }
    }
    if (event.clientX < ini) {
      if (event.clientX > ini - 100) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientX < ini - 100) {
        ini -= 100;
        to_col -= 1;
      }
    }
    setToCol(to_col);
    updateGroup.to_col({ group_id: cell.id, value: to_col - 2 });
    document.removeEventListener('mouseup', MouseUpXRight);
  }
  function MouseUpXLeft(event) {
    let ini = initPointerPos.x;
    let from_col = fromCol;
    if (event.clientX > ini) {
      if (event.clientX < ini + 100) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientX > ini + 100) {
        ini += 100;
        from_col += 1;
      }
    }
    if (event.clientX < ini) {
      if (event.clientX > ini - 100) {
        const Prect = Pref.current.getBoundingClientRect();
        setSize({ height: Prect?.height - 6, width: Prect?.width - 6 });
      }
      while (event.clientX < ini - 100) {
        ini -= 100;
        from_col -= 1;
      }
    }
    setFromCol(from_col);
    updateGroup.from_col({ group_id: cell.id, value: from_col - 1 });
    document.removeEventListener('mouseup', MouseUpXLeft);
  }

  function MouseUp() {
    document.removeEventListener('mousemove', MouseMoveXRight);
    document.removeEventListener('mousemove', MouseMoveXLeft);
    document.removeEventListener('mousemove', MouseMoveYTop);
    document.removeEventListener('mousemove', MouseMoveYBottom);
    document.removeEventListener('mouseup', MouseUp);
    selection?.enable();
  }

  function onMouseOver(event) {
    setInitPointerPos({ x: event.clientX, y: event.clientY });
  }

  function onClickScaleXLeft() {
    setRight('0');
    document.addEventListener('mousemove', MouseMoveXLeft);
    document.addEventListener('mouseup', MouseUp);
    document.addEventListener('mouseup', MouseUpXLeft);
    selection?.disable();
  }

  function onClickScaleXRight() {
    setRight('100');
    document.addEventListener('mousemove', MouseMoveXRight);
    document.addEventListener('mouseup', MouseUp);
    document.addEventListener('mouseup', MouseUpXRight);
    selection?.disable();
  }
  function onClickScaleYTop() {
    setTop('0');
    document.addEventListener('mousemove', MouseMoveYTop);
    document.addEventListener('mouseup', MouseUp);
    document.addEventListener('mouseup', MouseUpYTop);
    selection?.disable();
  }
  function onClickScaleYBottom() {
    setTop('100');
    document.addEventListener('mousemove', MouseMoveYBottom);
    document.addEventListener('mouseup', MouseUp);
    document.addEventListener('mouseup', MouseUpYBottom);
    selection?.disable();
  }

  if (action === 'groups' && edit == 'ערוך') {
    return (
      <div
        className="group-element-cont"
        ref={Pref}
        style={{
          gridRowStart: fromRow,
          gridColumnStart: fromCol,
          gridRowEnd: toRow,
          gridColumnEnd: toCol,
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
