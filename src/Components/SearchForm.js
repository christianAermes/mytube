// Component to enter a search query and search for matching videos on youtube

import React from "react"
import logo from  "./MyTube_logo.png"

function SearchForm(props) {
    return (
        <div className="search-form">
            <form  
                style={{lineHeight: "50px"}}
                onSubmit={(event) => {
                    props.handleSubmit(event)
                    event.preventDefault()
                }}
            >
                <img 
                    src={logo} 
                    alt="logo" 
                    style={{
                        width:"auto", 
                        height:"40px", 
                        display: "inline-block", 
                        verticalAlign:"middle",
                    }}    
                />
                <span style={{paddingRight: "20px", fontSize: "30px",  verticalAlign:"middle"}}><strong>MyTube</strong></span>
                <input
                    className="form-control"
                    style={{
                        verticalAlign: "bottom",
                        width: "300px",
                        display:"inline-block"
                    }}
                    autoComplete="off"
                    type="text"
                    name="videoSearch"
                    placeholder="Search..."
                    onChange={event => {props.handleChange(event)}}
                />
                
            </form>
            <hr/>
            <div id="buttonContainer">
                <button className="btn btn-light" onClick={()=> props.handleClick()}>Trending</button>
                <span className="vl"></span>
                <button className="btn btn-light" onClick={()=> props.randomVideos()}>Random</button>
            </div>
        </div>
  )  
}

export default SearchForm