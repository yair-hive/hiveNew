import { useRef } from "react"
import { useEffect } from "react"

function InputBox(props) {

    const inputRef = useRef(null)

    function offsetCalculate(){
        if(props.pos){
            var parent = props.pos.getBoundingClientRect()

            var top = parent.top 

            inputRef.current.style.width = parent.width+'px'
            inputRef.current.style.top = top+'px'
            inputRef.current.style.left = parent.left+'px'
                
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

    function onInput(event){
        props.setInputStr(event.target.value)
    }

    return ( 
        <input ref = {inputRef} dir='rtl' className="input_box name_box" onInput={onInput}></input>
    );
}

export default InputBox;