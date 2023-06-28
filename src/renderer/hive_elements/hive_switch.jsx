import { useEffect } from "react"
import HiveButton from "./hive_button"
import '../style/hive_switch.css'
import { useState } from "react"

function HiveSwitch({active, options, setActive, bordKey, multipleSelect}){

    const [intActive, setIntActive] = useState(active)
    const [intMultiActive, setIntMultiActive] = useState(active)


    useEffect(()=>{
        if(multipleSelect){
            setIntMultiActive([active])
            setActive([active])
        }else{
            setIntActive(active)
            setActive(active)
        }
    },[active])

    function onKeyDown(event){
        if(event.ctrlKey || event.metaKey){
            if(event.code == bordKey && !multipleSelect){
                hiveSwitchMove(options, intActive)
            }
        }
    }
    useEffect(()=>{
        document.addEventListener('keydown', onKeyDown)
        return ()=> document.removeEventListener('keydown', onKeyDown)
    })
    function hiveSwitchMove(itemsList, active){
        var length = itemsList.length -1
        var activeIndex = itemsList.indexOf(active)
        var i
        if(activeIndex == length) i = 0
        else i = activeIndex+1
        setIntActive(itemsList[i])
        setActive(itemsList[i])
    }
    function onClick(name){
        if(multipleSelect){
            if(intActive.indexOf(name) == -1){
                var new_active = [...intActive]
                new_active.push(name) 
                setIntActive(new_active)
                setActive(new_active)
            }else{
                var new_active = [...intActive]
                new_active.splice(new_active.indexOf(name), 1)
                setIntActive(new_active)
                setActive(new_active)
            }
        }else{
            setIntActive(name)
            setActive(name)
        }
    }
    function create_elements(){
        var i = 0
        var class_name
        return options?.map(element => {
            var name, value
            if(typeof element == 'string'){
                name = element
                value = element
            }
            if(typeof element == 'object'){
                name = element.name
                value = element.value
            }
            var isActive = false
            if(value === intActive) isActive = true
            if(multipleSelect){
                if(intActive.indexOf(value) != -1) isActive = true
            }
            class_name = 'hive-switch-m'
            if(i === 0) class_name = 'hive-switch-l'
            if(i === (options.length -1)) class_name = 'hive-switch-r'
            i++
            return <HiveButton onClick = {onClick} name={value} key={i} className={class_name} active={isActive}> {name} </HiveButton>
        })
    }
    return(
        <div className="hive-switch">
            {create_elements()}
        </div>
    )
}

export default HiveSwitch