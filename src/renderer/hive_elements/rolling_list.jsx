/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-assignment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// import { useRef, useState, useEffect } from "react"

// function ListItem(props){

//     const li_ref = useRef(null)

//     useEffect(()=>{
//         if(props.isActive) {
//             props.setCorrentRef(li_ref)
//         }
//     }, [props.isActive])

//     function onMouseOver(){
//         props.setIndex(props.index)
//     }

//     function onMouseOut(){
//         props.setIndex(-1)
//     }

//     return (
//         <li
//         ref={li_ref}
//         className={props.className}
//         onMouseOver={onMouseOver}
//         onMouseOut={onMouseOut}
//         onClick={props.onItem}
//         >
//             {props.item.name}
//         </li>
//     )
// }

// function RolligList(props) {

//     const [index, setIndex] = useState(0)
//     const [correntRef, setCorrentRef] = useState(null)
//     const ul_ref = useRef(null)

//     if(correntRef){
//         if(correntRef.current){
//             var corrnt_b = correntRef.current.getBoundingClientRect()
//             var ul_b = ul_ref.current.getBoundingClientRect()
//             if(corrnt_b.bottom > (ul_b.bottom - 30)){
//                 ul_ref.current.scrollTop = ul_ref.current.scrollTop + 30
//             }
//             if(corrnt_b.top < (ul_b.top + 30)){
//                 ul_ref.current.scrollTop = ul_ref.current.scrollTop - 30
//             }
//         }
//     }

//     function onItem(){
//         props.onItem(props.items[index])
//     }

//     function onKeyDown(event){
//         if(event.code === 'ArrowDown'){
//             // if(index < 0) setIndex(0)
//             // if(index == 0) return
//             setIndex(a => a + 1)
//         }
//         if(event.code === 'ArrowUp'){
//             setIndex(a => {
//                 if(a != 0) return a - 1
//                 if(a <= 0) return 0
//             })
//         }
//         if(event.code === 'Enter'){
//             onItem()
//         }
//     }
//     useEffect(()=>{
//         document.addEventListener('keydown', onKeyDown)
//         return ()=> document.removeEventListener('keydown', onKeyDown)
//     }, [index])

//     function create_list(){
//         var list = []
//         var i = 0
//         for(let item of props.items){
//             var className = "rolling_list_item"
//             var isActive = false
//             if(i === index){
//                 className += " active"
//                 isActive = true
//             }
//             var li = (<ListItem
//                 key={i}
//                 item={item}
//                 className={className}
//                 index={i}
//                 isActive={isActive}
//                 setIndex={setIndex}
//                 onItem ={onItem}
//                 setCorrentRef={setCorrentRef}
//                 />)
//             list.push(li)
//             i++
//         }
//         return list
//     }
//     return ( <ul className="rolling_list" ref={ul_ref}> {create_list()} </ul> );
// }

// export default RolligList;
import { useRef, useState, useEffect } from 'react';

function ListItem({
  item,
  isActive,
  onMouseOver,
  onMouseOut,
  onClick,
  setCurrentRef,
}) {
  const liRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      setCurrentRef(liRef);
    }
  }, [isActive]);

  return (
    <li
      ref={liRef}
      className={`rolling-list-item ${isActive ? 'active' : ''}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {item.name}
    </li>
  );
}

function RollingList({ items, onItemClick }) {
  const [index, setIndex] = useState(0);
  const [currentRef, setCurrentRef] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (currentRef && currentRef.current) {
      const currentRect = currentRef.current.getBoundingClientRect();
      const listRect = listRef.current.getBoundingClientRect();

      if (currentRect.bottom > listRect.bottom - 30) {
        listRef.current.scrollTop = listRef.current.scrollTop + 30;
      }

      if (currentRect.top < listRect.top + 30) {
        listRef.current.scrollTop = listRef.current.scrollTop - 30;
      }
    }
  }, [currentRef]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'ArrowDown') {
        setIndex((prevIndex) => {
          if (items.length > prevIndex + 1) return prevIndex + 1;
          return prevIndex;
        });
        event.preventDefault();
      } else if (event.code === 'ArrowUp') {
        setIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
        event.preventDefault();
      } else if (event.code === 'Enter') {
        if (items[index].onClick) items[index].onClick(items[index]);
        else onItemClick(items[index]);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, items, onItemClick]);

  const handleMouseOver = (i) => setIndex(i);
  const handleMouseOut = () => setIndex(-1);

  const renderListItems = () =>
    items.map((item, i) => {
      const onClick = item.onClick || onItemClick;
      return (
        <ListItem
          key={i}
          item={item}
          index={i}
          isActive={i === index}
          onMouseOver={() => handleMouseOver(i)}
          onMouseOut={handleMouseOut}
          onClick={() => {
            onClick(item);
          }}
          setCurrentRef={setCurrentRef}
        />
      );
    });

  return (
    <ul
      className="rolling-list"
      ref={listRef}
      style={{
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      {renderListItems()}
    </ul>
  );
}

export default RollingList;
