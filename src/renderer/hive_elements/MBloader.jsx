import { useContext } from 'react'
import { MBloaderContext } from '../app'
import '../style/MBloader.css'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// function MBloader(){

//     const [status, setStatus] = useContext(MBloaderContext)

//     if(status){
//         return(
//             <div className='MBloader-container'>
//                 <div className='loader-box'>
//                     <span className="loader"></span>
//                 </div>
//             </div>
//         )
//     }
// }

// export default MBloader

function MB(){
    const [progress, setProgress] = useState(0);
    const {map_name} = useParams()
    const [status, setStatus] = useContext(MBloaderContext)

    useEffect(() => {
        const source = new EventSource(`http://localhost:3025/actions/scheduling/${map_name}`);

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setProgress(data.progress);
            console.log(data)
        };

        source.onerror = (error) => {
            console.error('An error occurred:', error);
        };

        return () => {
            source.close();
        };
    }, []);

    // if(progress === 100) setStatus(false)

    return (
        <div className='loader-box' style={{color: 'white'}}>
            <div style={{ width: `${progress}%`, height: '20px', backgroundColor: 'blue' }} />
            <p>Progress: {progress}%</p>
        </div>
    )
}

const MBloader = () => {
    const [status, setStatus] = useContext(MBloaderContext)

    if(status == 101){
        return (
            <div className='MBloader-container'>
                <div className='loader-box' style={{color: 'white'}}>
                    <p> טוען </p>
                </div>
            </div>
        );
    }
    if(status != 0 && status != 100){
        return (
            <div className='MBloader-container'>
                <div className='loader-box' style={{color: 'white'}}>
                    <div style={{ width: `${status}%`, height: '20px', backgroundColor: 'blue' }} />
                    <p>Progress: {status}%</p>
                </div>
            </div>
        );
    }
};

export default MBloader;
