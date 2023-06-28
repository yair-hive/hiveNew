import React, { useEffect, useState } from "react"
import { Link, Route, Router, Routes, useNavigate, useParams } from "react-router-dom"
import AddMapPop from "../components/add_map_pop"
import Map from "../edit_map/map"
import MapSideMenu from "../edit_map/side_menu"
import GuestsTable from "../guests_list/guests_table"
import GuestsSideMenu from "../guests_list/side_menu"
import HiveButton from "../hive_elements/hive_button"
import HiveSwitch from "../hive_elements/hive_switch"
import { useMapsAllData } from "../querys/maps"
import ProjectSM from "./projects_sub_menu"
import { useLocation } from 'react-router-dom'

export const TableRefContext = React.createContext([])
export const FixedContext = React.createContext([])

function Projects(){

    const navigate = useNavigate()
    const {map_name} = useParams()
    const [TableRefState, setTableRefState] = useState(null)
    const [fixedState, setfixedState] = useState(false)

    const [map, setMap] = useState(null)
    const maps = useMapsAllData()
    
    var mapsOptions = maps.data?.map(map => map.map_name)

    useEffect(()=> {if(map) navigate(`map/${map}`)}, [map])

    const location = useLocation()
    const params = useParams()

    useEffect(()=> console.log(location), [location])
    useEffect(()=> console.log(params), [params])

    return(
        <>
        <FixedContext.Provider value={[fixedState, setfixedState]}>
        <TableRefContext.Provider value={[TableRefState, setTableRefState]}>
        <div className="main_bord">
            <Routes>
                <Route path="map/:map_name" element={<Map />}/>
                <Route path="guest/:map_name" element={<GuestsTable />}/>
            </Routes>
        </div>
        <div className="side_menu">
            <HiveSwitch 
                options={mapsOptions} 
                active={map_name}
                setActive={setMap} 
                bordKey="KeyQ" 
            />
            <Routes>
                <Route path="guest/:map_name" element={<GuestsSideMenu />}/>
                <Route path="map/:map_name" element={<><MapSideMenu /><ProjectSM /></>}/>
                <Route path="/" element={<><MapSideMenu /><ProjectSM /></>}/>
            </Routes>
        </div>
        </TableRefContext.Provider>
        </FixedContext.Provider>
        </>
    )
}

export default Projects