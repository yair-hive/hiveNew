import { useContext } from "react"
import { BelongsContext, GroupsContext, TagsContext } from "../app"
import TagsCount from "../components/tags_count"
import { TdFirst, TdGroup, TdLast, TdRequests, TdScore, TdX } from "./tds_components"

function TableRow(props){

    const [belongsStatus, setBelongsStatus] = useContext(BelongsContext)
    const [groupsStatus, setGroupsStatus] = useContext(GroupsContext)
    const [tagsStatus, setTagsStatus] = useContext(TagsContext)

    var belong
    var tags_ids = props.tags?.map(tag => tag.tag)
    if(!props.guest) return
    if(props.seat) belong = 'belong'
    if(props.seat && belongsStatus == 'לא משובצים') return
    if(!props.seat && belongsStatus == 'משובצים') return
    if(groupsStatus != 'הכל' && groupsStatus != props.group?.name) return
    if(tagsStatus != 'הכל' && !props.tags) return
    if(tagsStatus != 'הכל' && tags_ids?.indexOf(tagsStatus) == -1) return

    return(
        <tr>
            <td className={'seat_number'} belong={belong}>{props.seat?.seat_number}</td>
            <td className="td_tags"><TagsCount tags={props.tags}/></td>
            <TdLast last_name={props.guest.last_name} guest_id={props.guest.id}/>
            <TdFirst first_name={props.guest.first_name} guest_id={props.guest.id}/>
            <TdGroup group={props.group?.name} guest_id={props.guest.id}/>
            <TdScore guest_score={Number(props.guest.score)} group_score={Number(props.group?.score)} guest_id={props.guest.id}/>
            <TdRequests guest_id={props.guest.id} setDropPos={props.setDropPos} setSelectedGuest={props.setSelectedGuest}/>
            <TdX guest_id={props.guest.id}/>
        </tr>
    )
}

export default TableRow