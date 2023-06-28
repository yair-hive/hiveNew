import { useState } from "react"
import readXlsxFile from "read-excel-file"
import HiveButton from "../hive_elements/hive_button"
import PopUp from "../hive_elements/pop_up"
import { useGuestsCreate } from "../querys/guests"

function ImportGuests(props){

    const [file, setFile] = useState()
    const create_guests = useGuestsCreate()

    function onChange(event){
        setFile(event.target.files[0])
    }

    async function onClick(){
        var rows = await readXlsxFile(file)
        create_guests(rows)
        props.setState(false)
    }

    return(<PopUp
        status={props.status} 
        setState = {props.setState}
        title = 'יבא'
    >
        <form id='import_guests_form'>
            <h2> ייבא בחורים </h2>
            <label> בחר קובץ אקסאל </label> 
            <br />
            <input onChange={onChange} type="file" accept=".xls,.xlsx" />
            <br />
            <HiveButton onClick={onClick}> ייבא </HiveButton>	
        </form>
    </PopUp>)
}

export default ImportGuests