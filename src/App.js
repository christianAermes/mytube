// Main component

import React, { Component } from 'react';
import VideoTile from "./Components/VideoTile"
import SearchForm from "./Components/SearchForm"
import rnd_ids_json from "./rndVideoGenerator/rnd_ids.js"

class App extends Component {
  	constructor() {
    	super()
		this.state = {
			videos: [], // list of videos to be displayed as video tiles
			error: null
		}
		
		this.apiKey = "YOUR_API_KEY_HERE"
		this.base = " https://www.googleapis.com/youtube/v3/"
		
		// some methods for using the youtube API
		this.searchVideos    = this.searchVideos.bind(this)
		this.listTrending    = this.listTrending.bind(this)
		this.handleSubmit    = this.handleSubmit.bind(this)
		this.handleChange    = this.handleChange.bind(this)
		this.getRandomVideos = this.getRandomVideos.bind(this)
	}

	handleSubmit(event) {
		let value = this.state.search // search query entered by the user
		console.log(value)
		this.searchVideos(value, 20)
	}

	handleChange(event) {
		this.setState({search: event.target.value})
	}

	getVideosById(ids) {
		// expects a list of youtube video ids
		// calls the youtube API to get the corresponding videos

		fetch(`${this.base}videos?id=${ids}&part=snippet,contentDetails&key=${this.apiKey}`)
		.then(data => data.json())
		.then(data => {
			console.log(data)
			let videos = data.items.map(item => {
				// construct a video object
				return {
					id: data.items.indexOf(item),
					videoId: item.id,
					videourl: "https://youtube.com/watch?v="+item.id,
					thumbnail: item.snippet.thumbnails.high.url,
					title: item.snippet.title,
					channel: item.snippet.channelTitle,
					description: item.snippet.description,
					duration: item.contentDetails.duration
				}
			})
			return videos
		})
		.then((videos) => this.setState({videos: videos}))
		.catch(err => {
			console.log(err.message)
			this.setState({error: err.message})
		})
	}
  
	getRandomVideos(maxResults=10) {
		// read random ids from JSON Array
		let rndIds = rnd_ids_json.ids
		console.log(rndIds.length)
		// randomly shuffle ids and select the first 10 or so elements
		// (pseudo random videos)
		let shuffled = rndIds.sort(()=>0.5-Math.random())
		let ids = shuffled.slice(0, maxResults)
		this.getVideosById(ids)
	}

	searchVideos(searchKey, maxResults=10) {
		// calls the youtube API to return a list of videos where the searchkey matches the video title, channel name, description, ...
		fetch(`${this.base}search?q=${searchKey}&maxResults=${maxResults}&part=snippet&type=video&key=${this.apiKey}`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			let ids = data.items.map(item => {
				console.log(item.id.kind)
				return item.id.videoId
			})
			return ids
		})
		.then(ids => {
			ids = ids.join(",")
			this.getVideosById(ids)
		})
		.catch(err => {
			console.log(err.message)
			this.setState({error: err.message})
		})
	}

	listTrending(maxResults=10) {
		// calls the youtube API to get a list of the 10 most trending videos in the US
		fetch(`${this.base}videos?chart=mostPopular&regionCode=US&maxResults=${maxResults}&part=snippet,contentDetails&key=${this.apiKey}`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			let videos = data.items.map(item => {
				return {
					id: data.items.indexOf(item),
					videoId: item.id,
					videourl: "https://youtube.com/watch?v="+item.id,
					thumbnail: item.snippet.thumbnails.high.url,
					title: item.snippet.title,
					channel: item.snippet.channelTitle,
					description: item.snippet.description,
					duration: item.contentDetails.duration
				}
			})
			return videos
		})
		.then((videos) => this.setState({videos: videos}))
		.catch(err => {
			console.log(err.message)
			this.setState({error: err.message})
		})
	}

	componentDidMount() {
		// on mounting, display either random videos or the most trending ones
		console.log("Mounted!")
		// this.listTrending()
		this.getRandomVideos()
	}

	render() {
		// construct an array of video tile components from the array of videos 
		let videoTiles = this.state.videos.map(video => <VideoTile key={video.id} item={video}/>)

		let videolistStyle = {
			background: "white",
			margin: "auto",
			width: "600px",
			padding: "20px",
			borderRadius: "6px",
			marginTop: "200px"
		}

		return (
			<div className="App">
				
				<SearchForm handleSubmit={this.handleSubmit} handleChange={this.handleChange} handleClick={this.listTrending} randomVideos={this.getRandomVideos}/>
				
				<div className="video-list" style={videoTiles.length>0? videolistStyle : null}>
					{videoTiles}
				</div>
			</div>
		)
	}
}

export default App;