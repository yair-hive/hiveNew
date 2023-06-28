import DropDown from "../hive_elements/dropDown"
import RollingList from "../hive_elements/rolling_list"
import { useRequestsBelongsCreate } from "../querys/requests_belongs"
import { useTagsData } from "../querys/tags"

function RequestsDrop(props){

    const tags = useTagsData()
    const add_request = useRequestsBelongsCreate()

    function createItems(){
        if(tags.data){
            var tags_array = Object.entries(tags.data)
            var items = []
            for(let [key, tag] of tags_array){
                items.push({name: tag.name, value:tag.id})
            }
            return items
        }
    }

    function onItem(item){
        var data = {
            guest_id: props.selected,
            tag_id: item.value,
        }
        add_request(data)
        .then(()=>{
            props.setPos(null)
            props.setSelected(null)
        })
    }

    return (
        <DropDown pos={props.pos}>
            <RollingList items={createItems()} onItemClick={onItem}/>
        </DropDown>
    )
}

export default RequestsDrop