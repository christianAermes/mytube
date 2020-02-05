// Component to display a single video
// Display includes thumbnail, title, channel, description, duration

import React from "react"
import {parse} from 'iso8601-duration' // for formatting video duration

function VideoTile(props) {
    let item = props.item

    // format the time nicely
    let duration = parse(item.duration)
    let time = ""
    if (duration.hours > 0) time+=duration.hours+":"
    time += duration.minutes
    time += ":"
    time = duration.seconds < 10? time +"0"+duration.seconds : time +duration.seconds
    
    // limit the description to be displayed to 150 characters (including whitespace)
    let description = item.description.split("").slice(0,150).join("") + "..."
    
    return (
        <div className="video-tile">
            <a href={item.videourl} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", color: "black"}}>
                <div>
                    <img src={item.thumbnail} alt={item.descripton}/>
                    <p>{time}</p>
                </div>
                <div className="video-details">
                    <h3>{item.title}</h3>
                    <h5>{item.channel}</h5>
                    <p className="video-description">{description}</p>
                </div>
            </a>
            <hr/>
        </div>
    )
}

export default VideoTile