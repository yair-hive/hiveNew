import { useTagsData } from "../querys/tags";

function getColor(backColor){
    if(backColor){
        var color = 'black'
        var c = backColor.substring(1);      // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue
    
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        if (luma < 160) {
            color = 'white'
        }
        return color
    }
}

function TagsCount({value}){
    const tags = useTagsData()
    if(value){
        if(tags.data){
            var i = 0
            return (<div className="tags_cont"> {value.map(tag_id =>{
                var tag = tags.data[tag_id.tag]
                var color = getColor(tag.color)
                var style = {
                    backgroundColor: tag.color,
                    color: color
                }
                i++
                return(<div key={i} style = {style} className="tag_box">
                    {tag.name}
                </div>)
            })} </div>)
        }
    }
}

export default TagsCount