import { useContext, useEffect, useRef, useState } from "react"
import { useGuestsDelete, useGuestsUpdate } from "../querys/guests"
import RequestsCount from "../components/requestsCount"
import { useRequestsBelongsData } from "../querys/requests_belongs"

export function TdLast(props){

    const [isLastInput, setLastInput] = useState(false)
    const [last, setLast] = useState(props.last_name)
    const update_last = useGuestsUpdate().last

    function onTdClick(){
        setLastInput(true)
    }

    useEffect(()=>{
        setLast(props.last_name)
    }, [props.last_name])

    function onInputBlur(){
        setLastInput(false)
        update_last({last: last, guest_id: props.guest_id})
    }

    function onInputChange(event){
        setLast(event.target.value)
    }

    if(isLastInput){ 
        return (
        <td style={{
            backgroundColor: 'white'
        }}>
            <input 
                type='text' 
                autoFocus 
                value={last} 
                onBlur={onInputBlur}
                onChange={onInputChange}
                style={{
                    width: `${last.length}ch`
                }}
            />
        </td>
        )
    }

    return <td onClick={onTdClick}>{last}</td>
}
export function TdFirst(props){

    const [isFirstInput, setFirstInput] = useState(false)
    const [first, setFirst] = useState(props.first_name)
    const update_first = useGuestsUpdate().first

    useEffect(()=> setFirst(props.first_name), [props.first_name])

    function onTdClick(){
        setFirstInput(true)
    }

    function onInputBlur(){
        setFirstInput(false)
        update_first({first: first, guest_id: props.guest_id})
    }

    function onInputChange(event){
        setFirst(event.target.value)
    }

    if(isFirstInput){ 
        return (
        <td style={{
            backgroundColor: 'white'
        }}>
            <input 
                type='text' 
                autoFocus 
                value={first} 
                onBlur={onInputBlur}
                onChange={onInputChange}
                style={{
                    width: `${first.length}ch`
                }}
            />
        </td>
        )
    }

    return <td onClick={onTdClick}>{first}</td>
}
export function TdGroup(props){

    const [isGroupInput, setGroupInput] = useState(false)
    const [group, setGroup] = useState(props.group)
    const update_group = useGuestsUpdate().group

    useEffect(()=> setGroup(props.group), [props.group])

    function onTdClick(){
        setGroupInput(true)
    }

    function onInputBlur(){
        setGroupInput(false)
        update_group({group: group, guest_id: props.guest_id})
    }

    function onInputChange(event){
        setGroup(event.target.value)
    }

    if(isGroupInput){ 
        return (
        <td style={{
            backgroundColor: 'white'
        }}>
            <input 
                type='text' 
                autoFocus 
                value={group} 
                onBlur={onInputBlur}
                onChange={onInputChange}
                style={{
                    width: `${group.length}ch`
                }}
            />
        </td>
        )
    }

    return <td onClick={onTdClick}>{group}</td>
}
export function TdScore(props){

    const [isScoreInput, setScoreInput] = useState(false)
    const [score, setScore] = useState(props.guest_score + props.group_score)
    const update_score = useGuestsUpdate().score

    useEffect(()=> setScore(props.guest_score + props.group_score), [props.guest_score, props.group_score])

    function onTdClick(){
        setScoreInput(true)
    }

    function onInputBlur(){
        update_score({guest_id: props.guest_id, score: (score -props.group_score)})
        setScoreInput(false)
    }

    function onInputChange(event){
        setScore(Number(event.target.value))
    }

    if(isScoreInput){ 
        return (
        <td style={{
            backgroundColor: 'white'
        }}>
            <input 
                type='text' 
                autoFocus 
                value={score} 
                onBlur={onInputBlur}
                onChange={onInputChange}
                style={{
                    width: `${score.toString().length}ch`
                }}
            />
        </td>
        )
    }

    return <td onClick={onTdClick}>{score}</td>
}
export function TdX(props){

    const delete_guest = useGuestsDelete()
 
    function on_td_x(){
        delete_guest({guest_id: props.guest_id})
    }

    return (<td className="td_x" onClick={on_td_x}> x </td>)
}
export function TdRequests(props){

    const value = props.value
    const guest_id = props.cell.row.id

    const [dropPos, setDropPos] = useContext(null)
    const [selectedGuest, setSelectedGuest] = useContext(undefined)

    const tdRef = useRef(null)

    function onClick(event){
        var classList = event.target.classList
        if(!classList.contains('delete')){
            setDropPos(tdRef.current)
            setSelectedGuest(props.guest_id)
        }
    }

    return (
        <div ref={tdRef} onClick={onClick} className='td_requests'>
            <RequestsCount value={value}/>
        </div>
    )
}