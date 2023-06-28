import { useRef } from 'react'
import { useEffect } from 'react'
import '../style/drop_down.css'

function DropDown(props){

    const divRef = useRef(null)

    function offsetCalculate(){
        if(props.pos){
            var parent = props.pos.getBoundingClientRect()
            var drop = divRef.current.getBoundingClientRect()
            var parent_width = parent.width
            var list_width_over = drop.width - parent_width
            var list_width_over_d = list_width_over / 2
            var drop_down_top = parent.bottom
            var drop_down_width = parent_width + list_width_over
            var drop_down_left = parent.left - list_width_over_d 
                             
            divRef.current.style.width = drop_down_width+'px'
            divRef.current.style.top = drop_down_top+'px'
            divRef.current.style.left = drop_down_left+'px'
        }
    }

    useEffect(()=>{
        offsetCalculate()
    }, [props.pos])
    

    useEffect(()=>{
        document.addEventListener('resize', offsetCalculate)
        return ()=> document.removeEventListener('resize', offsetCalculate)
    }, [props.pos])

    useEffect(()=>{
        var main_bord = document.getElementsByClassName('main_bord')[0]
        main_bord.addEventListener('scroll', offsetCalculate)
        return ()=> main_bord.removeEventListener('scroll', offsetCalculate)
    }, [props.pos])

    if(!props.pos) return

    return (<div className="drop_down" ref={divRef}>
        {props.children}
    </div>)

}

export default DropDown