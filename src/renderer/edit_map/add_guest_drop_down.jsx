import { useContext, useEffect, useState } from "react"
import DropDown from "../hive_elements/dropDown"
import RolligList from "../hive_elements/rolling_list"
import new_api from "../new_api/new_api"
import { useGuestsData } from "../querys/guests"
import { useSeatBelongsCreate } from "../querys/seat_belongs"
import InputBox from "./input_box"
import { DropContext, SelectedContext } from "./map"

function AddGuestDropDown(props){

    const guests = useGuestsData()

    const [inputStr, setInputStr] = useState('')
    const check_guest = new_api.seat_belongs.check
    const add_guest = useSeatBelongsCreate()
    const [dropDownPos, setDropDownPos] = useContext(DropContext)
    const [selected_seat, setSelectedSeat] = useContext(SelectedContext)

    useEffect(()=> setInputStr(''),[dropDownPos])

    async function onItem(item){
        console.log(item)
        // const {exist} = await check_guest(item.value)
        // if(exist){
            add_guest({
                guest_id: item.value, 
                seat_id: selected_seat
            })
        // }
        setDropDownPos(null)
        setSelectedSeat(null)
    }

    function createMatchList(){
        var match_list = [] 
        if(inputStr.length != 0){
            var search_reg = new RegExp('^'+inputStr)
            var guest_array = Object.entries(guests.data)
            for(var [index, corrent] of guest_array){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(search_reg.test(corrent.name)){
                    match_list.push({name: corrent.name, value: corrent.id})
                }
            }
        }
        return match_list
    }

    return (
        <>
        <InputBox pos={dropDownPos} setInputStr={setInputStr}></InputBox>
        <DropDown pos={dropDownPos}>
            <RolligList items={createMatchList()} onItemClick={onItem}/>
        </DropDown>
        </>
    )
}

export default AddGuestDropDown