import React from "react";
import '../style/home.css'

function Home(){
    return(
        <div style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            gridColumnStart: 1,
            gridColumnEnd: 3,
        }}>
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>
            <div className="main_content">
                <h1 style={{fontSize: '40px'}}> ברוכים הבאים </h1>
                <span> הדרך הקלה ביותר לבניות מפות ושיבוץ אוטומטי </span>
            </div>
        </div>
    )
}

export default Home