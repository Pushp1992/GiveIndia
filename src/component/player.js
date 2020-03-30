import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, FormGroup, Input, Card, CardBody, CardTitle, CardFooter, Badge, Alert } from "reactstrap";
import ReactPlayer from 'react-player'

import Reorder from 'react-reorder';

// custom Input and styles
import '../component/common.css';
import Button from './Button/button';
import CustomToastr from '../utils/toaster';

Container.propTypes = {
    fluid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}
Row.propTypes = {
    noGutters: PropTypes.bool
}


const defaultState = {
    youTubeVideos: {
        videoUrl: '',
    },
    currentVideo: 'https://www.youtube.com/watch?v=WWb4TxS-p9E',
    tempPlaylist: [],
    playlist: [],
    counter: 0,
}

export default class YouTubePlayer extends Component {
    constructor(props) {
        super(props)

        this.state = defaultState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addVideoToPlaylist = this.addVideoToPlaylist.bind(this);
        this.loadVideo = this.loadVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.playNextVideo = this.playNextVideo.bind(this);
    }

    handleInputChange(event) {
        event.preventDefault();

        var { name, value } = event.currentTarget;

        this.setState(
            prevState => ({
                youTubeVideos: {
                    ...prevState.youTubeVideos,
                    [name]: value
                }
            })
        )

        console.log("input", this.state.youTubeVideos.videoUrl)
    }

    addVideoToPlaylist = (event) => {
        event.preventDefault()

        let url = this.state.youTubeVideos.videoUrl;

        if (url !== "") {
            this.validateYoutubeVideo(url);
        } else {
            CustomToastr.warning("URl cannot be blank")
            return false;
        }

        console.log("playslist", this.state.playlist)
    }

    validateYoutubeVideo(url) {
        var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

        if (url.match(regExp)) {
            this.state.tempPlaylist.push(this.state.youTubeVideos.videoUrl)
            this.setState({ playlist: this.state.tempPlaylist })
            this.setState({ counter: this.state.counter + 1 })
            this.state.youTubeVideos.videoUrl = '';

            if(this.state.playlist.length === 0) {
                this.setState({ currentVideo: url })
            }

            console.log("counter", this.state.counter)
            CustomToastr.success("Video added to Playlist")

        } else {
            CustomToastr.error("Invalid YouTube URL")
            return false;
        }
    }

    loadVideo = (event) => {
        event.preventDefault();

        let selectedVideoUrl = event.currentTarget.value
        this.setState({ currentVideo: selectedVideoUrl })

        CustomToastr.success("Please wait.. Loading your video")
    }

    removeVideo = (event) => {
        event.preventDefault();

        let urlToDelete = event.currentTarget.value;
        let indexOfVideo = this.state.playlist.indexOf(urlToDelete);
        this.state.playlist.splice(indexOfVideo, 1);
        this.setState(this.state.playlist);

        if(indexOfVideo < this.state.playlist.length ) {
            this.setState({currentVideo: this.state.playlist[indexOfVideo]});
            console.log("next vide", this.state.currentVideo)
        }

        CustomToastr.success(`video ${indexOfVideo + 1} is removed. \n Reshuffling your playlist`)
    }

    playNextVideo() {

        // llogic for removing played video
        let indexOfPlayedVideo = this.state.playlist.indexOf(this.state.currentVideo);
        this.state.playlist.splice(indexOfPlayedVideo, 1)
        this.setState(this.state.playlist);

        // logic for playing new video
        let playingVideo = this.state.currentVideo;
        let indexOfPlayingVideo = this.state.playlist.indexOf(playingVideo)
        let indexOfNextVideo = indexOfPlayingVideo + 1;

        if (this.state.playlist.length === 0) {
            CustomToastr.warning("Your playlist is empty. Please add video to Playlist");
            return;
        }
        if (indexOfNextVideo > this.state.playlist.length) {
            CustomToastr.warning("This was your Last Playlist video")
            return;
        }

        this.setState({ currentVideo: this.state.playlist[indexOfNextVideo] })
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid={true}>
                    <Row noGutters={false}>
                        <Col md={{ size: 5 }}>
                            <h2>YouTubePlayer</h2>
                            <ReactPlayer url={this.state.currentVideo} playing={this.state.playlist.length > 0 ? true : false} onEnded={this.playNextVideo} controls={true} />
                        </Col>
                        <Col md={{ size: 6, offset: 1 }}>
                            <div><h2>Playlist</h2></div>
                            <Row>
                                <Col md={{ size: 5 }}>
                                    <FormGroup>
                                        <Input type="text" name="videoUrl" value={this.state.youTubeVideos.videoUrl} onChange={this.handleInputChange} placeholder="add youtube video url here . . ." />
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 2 }}>
                                    <FormGroup>
                                        <Button handleClick={this.addVideoToPlaylist} type="warning" label="add video" />
                                    </FormGroup>
                                </Col>
                                <Col md={{size: 3}}>
                                <a href="https://jsoneditoronline.org/#left=cloud.90764c201b40437eae526c9032e59c2b" target="_blank" id="videoList">Show List</a>
                                </Col>
                            </Row>
                            <Row noGutters={true}>
                                <Col md={{ size: 5 }}>
                                    <FormGroup>
                                        <Reorder
                                            reorderId={this.state.currentVideo}
                                            reorderGroup="reorder-group"
                                            component="ul"
                                            placeholderClassName="placeholder"
                                            draggedClassName="dragged"
                                            lock="horizontal"
                                            holdTime={500}
                                            touchHoldTime={500}
                                            mouseHoldTime={200}
                                            autoScroll={true}
                                            disabled={false}
                                            disableContextMenus={true}
                                        >
                                            {
                                                this.state.playlist.length !== 0 ?
                                                    this.state.playlist.map((key, video) => {
                                                        return (
                                                            <Row noGutters={false} key={video}>
                                                                <Col md={{ size: 3 }}>
                                                                    <Button handleClick={this.loadVideo} value={key} type="playBtn" label={`video ${video + 1}`} />
                                                                </Col>
                                                                {
                                                                    this.state.playlist.indexOf(this.state.currentVideo) === this.state.playlist.indexOf(key) ?
                                                                        <Col md={{ size: 5, offset: 1 }}>
                                                                            <label className="nowPlayingText" >Now Playing . . .</label>
                                                                        </Col>
                                                                        : null
                                                                }
                                                                <Col md={{ size: 2, offset: 1}}>
                                                                    <Button handleClick={this.removeVideo} value={key} type="deleteBtn" label="x" />
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }) : null
                                            }
                                        </Reorder>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}