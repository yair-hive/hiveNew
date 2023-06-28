import PlaseHolder from "./plase_holder"
import GroupElement from "./group_element"
import MapElement from "./map_element"
import RCselector from "./RCselector"
import Seat from "./seat"

function Cell(props){
    if(!props.cell) return null
    if(props.cell.type === 'element') return <MapElement cell={props.cell}/>
    if(props.cell.type === 'group') return <GroupElement cell={props.cell}/>
    if(props.cell.type === 'seat') return <Seat seat={props.cell}/>
    if(props.cell.type === 'RC') return <RCselector cell={props.cell}/>
    if(props.cell.type === 'plase_holder') return <PlaseHolder cell={props.cell}/>
}

export default Cell