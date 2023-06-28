import { useContext, useEffect, useRef, useState } from 'react'
import { EditContext, SelectablesContext } from '../app'
import '../style/elements.css'

function MapElement({cell}){

    const [edit, setEdit] = useContext(EditContext)
    const Pref = useRef(null)
    const [Cstyle, setCstyle] = useState({})
    const [selectebls] = useContext(SelectablesContext)

    useEffect(()=> {
        var Prect = Pref.current.getBoundingClientRect()
        if(Prect.height > Prect.width) setCstyle({transform: 'rotate(90deg)'})
    },[])

    cell.from_row = Number(cell.from_row)
    cell.from_col = Number(cell.from_col)
    cell.to_row = Number(cell.to_row)
    cell.to_col = Number(cell.to_col)

    var {from_row, from_col, to_row, to_col} = cell

    to_row++
    to_col++

    if(edit == 'ערוך'){
        from_row++
        from_col++
        to_row++
        to_col++
    }

    return(
        <div 
            className={`map-element ${(selectebls === 'cells' ? 'selectable' : '')}`}
            ref={Pref}
            element_id={cell.id}
            style={{
                gridRowStart: from_row,
                gridColumnStart: from_col,
                gridRowEnd: to_row,
                gridColumnEnd: to_col,
                color: 'white'
            }} 
        >
            <div style={Cstyle}>{cell.name}</div>
        </div>
    )
}

export default MapElement