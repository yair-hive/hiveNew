import '../style/hive_button.css'

function HiveButton(props){
    var class_name = 'hive_button'
    if(props.active) class_name = 'hive_button active'
    if(props.className) class_name = class_name + ' ' + props.className
    var button_name = props.name
    var onClick = function(){
        if(props.onClick){
            props.onClick(button_name)
        }
    }
    return (
        <div name={props.name} className={class_name} onClick={onClick}>{props.children}</div>
    )
}

export default HiveButton