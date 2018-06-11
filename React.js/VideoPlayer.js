/*///////////////////////////////////////////////// INFORMATION //////////////////////////////////////////////////////

    <VideoPlayer url=*STRING*  height=*INTEGER* width=*INTEGER* />

__________________________________________________________________________________________________________________________
        Property                        |            Description
_______________________________________ |_________________________________________________________________________________      
    1) url                              |  String of video URL.  This component only accepts YouTube and Vimeo URLs
                                        |  
----------------------------------------|---------------------------------------------------------------------------------
    2) height (optional)                |  Integer height size.  Default is 390.
                                        |      
----------------------------------------|--------------------------------------------------------------------------------
    3) width (optional)                 |  Integer width size.  Default is 640.
                                        |  
_________________________________________________________________________________________________________________________
*/ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React from "react";
import { videoPlayerAnalytics_post } from "./server";
class VideoPlayer extends React.Component {
  componentDidMount() {
    if (/youtube.com/i.test(this.props.url)) {
      window.YouTubePromise.then(YT => {
        this.player = new YT.Player(this.player, {
          height: this.props.height || 390,
          width: this.props.width || 640,
          videoId: this.props.url.split("v=")[1].split("&")[0],
          events: {
            onStateChange: this.onYouTubeStateChange
          }
        });
      });
    } else if (/vimeo.com/i.test(this.props.url)) {
      window.VimeoPromise.then(Vimeo => {
        this.player = new Vimeo.Player(this.player, {
          height: this.props.height || 390,
          width: this.props.width || 640,
          url: this.props.url
        });
        this.player.on("bufferstart", this.handleVimeoBufferStart);
        this.player.on("error", event =>
          this.handleVimeoStateChange(event, "error")
        );
        this.player.on("pause", event =>
          this.handleVimeoStateChange(event, "pause")
        );
        this.player.on("ended", event =>
          this.handleVimeoStateChange(event, "ended")
        );
        this.player.on("seeked", event =>
          this.handleVimeoStateChange(event, "seeked")
        );
        this.player.on("play", event =>
          this.handleVimeoStateChange(event, "play")
        );
      });
    }
  }

  youtubeEventStateName = youtubeEventState => {
    switch (youtubeEventState) {
      case -1:
        return "unstarted";
        break;
      case 0:
        return "ended";
        break;
      case 1:
        return "playing";
        break;
      case 2:
        return "paused";
        break;
      case 3:
        return "buffering";
        break;
      case 5:
        return "video cued";
        break;
    }
  };

  onYouTubeStateChange = event => {
    const youtubeEvent = {
      UserId: null,
      Event: {
        videoPlayer: "Youtube",
        youtubeEventState: this.youtubeEventStateName(event.data),
        videoId: event.target.b.b.videoId,
        eventData: {
          duration: event.target.getDuration(),
          percent: event.target.getCurrentTime() / event.target.getDuration(),
          seconds: event.target.getCurrentTime()
        }
      }
    };
    videoPlayerAnalytics_post(youtubeEvent);
  };

  handleVimeoBufferStart = () => {
    this.player.getCurrentTime().then(currentTime => {
      let vimeoEvent = {
        UserId: null,
        Event: {
          videoPlayer: "Vimeo",
          vimeoEventState: "bufferstart",
          videoId: "",
          eventData: {
            seconds: currentTime
          }
        }
      };
      this.player.getVideoId().then(id => {
        vimeoEvent.Event.videoId = id;
        videoPlayerAnalytics_post(vimeoEvent);
      });
    });
  };

  handleVimeoStateChange = (event, vimeoEventState) => {
    let vimeoEvent = {
      UserId: null,
      Event: {
        videoPlayer: "Vimeo",
        vimeoEventState: vimeoEventState,
        videoId: "",
        eventData: event
      }
    };
    this.player.getVideoId().then(id => {
      vimeoEvent.Event.videoId = id;
      videoPlayerAnalytics_post(vimeoEvent);
    });
  };

  render() {
    return (
      <section>
        <div
          ref={vp => {
            this.player = vp;
          }}
        />
      </section>
    );
  }
}
export default VideoPlayer;
