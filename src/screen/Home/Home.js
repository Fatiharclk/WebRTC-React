import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserList from "../../components/UserList/UserList";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import MeadiaControl from "../../components/MediaControl/MediaControl";
function Home() {
  const Socket = useSelector((state) => state.Socket);
  const User = useSelector((state) => state.User);
  const navigate = useNavigate();
  //Refferences
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pc = useRef();

  const [mic, setMic] = useState(false);
  const [camera, SetCamera] = useState(false);

  const [answerVisible, setAnswerVisible] = useState(false);
  const [status, setStatus] = useState("");

  if (!!!Socket.socketid) {
    navigate("/");
  }

  useEffect(() => {
    //Socket Connected State Control
    Socket.socket.on("connection-success", (success) => {
      console.log(success);
    });

    Socket.socket.on("call-name", (data) => {
      setStatus(data + " Gelen Çagrı");
    });

    //
    Socket.socket.on("sdp", (data) => {
      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === "offer") {
        setAnswerVisible(true);
      } else {
        setStatus("Bağlantı Sağlandı");
      }
    });

    //Candidate Listen SokcetIO
    Socket.socket.on("candidate", (candidate) => {
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    //User Media Settings (Mic and Camera)
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        //display video

        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          _pc.addTrack(track, stream);
        });
      })
      .catch((e) => {
        console.log("Get User Media Error", e);
      });

    //RTCPeerConnections Created
    const _pc = new RTCPeerConnection(null);
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendToPeer("candidate", e.candidate);
      }
    };

    _pc.oniceconnectionstatechange = (e) => {
      console.log("State", e);
    };

    _pc.ontrack = (e) => {
      //Meet user stream data
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.current = _pc;
  }, []);

  const sendToPeer = (eventType, payload) => {
    Socket.socket.emit(eventType, payload);
  };

  const processSDP = (sdp, socketid, name) => {
    pc.current.setLocalDescription(sdp);
    sendToPeer("sdp", { sdp: { sdp }, socketid: socketid, name: name });
  };

  const processSDPbroadcast = (sdp) => {
    pc.current.setLocalDescription(sdp);
    sendToPeer("sdp-broadcast", { sdp: { sdp } });
  };

  const createOffer = (socketid) => {
    console.log("CreateOffer", User.name);
    pc.current
      .createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      })
      .then((sdp) => {
        processSDP(sdp, socketid, User.name);

        setStatus("Aranıyor ...");
      })

      .catch((e) => console.log(e));
  };

  const createAnswer = () => {
    pc.current
      .createAnswer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      })
      .then((sdp) => {
        processSDPbroadcast(sdp);
        setAnswerVisible(false);
        setStatus("Bağlantı Sağlandı");
      })
      .catch((e) => console.log(e));
  };

  //Open/Close Camera
  const CameraMute = () => {
    var stream = localVideoRef.current.srcObject;
    var truck = stream.getTracks().filter((track) => track.kind === "video");
    console.log("truck", truck);
    truck[0].enabled = camera;
    SetCamera(!camera);
  };
  //Open/Close Mic
  const MicMute = () => {
    var stream = localVideoRef.current.srcObject;
    console.log("stream.getTracks()", stream);
    var truck = stream.getTracks().filter((track) => track.kind === "audio");
    console.log("truck", truck);
    truck[0].enabled = mic;
    setMic(!mic);
  };

  const showHideButtons = () => {
    if (answerVisible) {
      return (
        <div>
          <button className="Home-Answer-Button" onClick={createAnswer}>
            Cevapla
          </button>
        </div>
      );
    }
  };

  return (
    <div className="Home">
      <UserList Call={(socketid) => createOffer(socketid)} />
      <div></div>
      <div className="Home-MeetScreen">
        <div className="Home-Header-Panel">
          <video className="Home-Camera" ref={localVideoRef} autoPlay></video>
        </div>
        <MeadiaControl
          CameraMute={CameraMute}
          MicMute={MicMute}
          mic={mic}
          camera={camera}
        />
        <video
          className="Home-VideoStream"
          ref={remoteVideoRef}
          autoPlay
        ></video>
        <div className="Home-Status-Panel">
          {status}
          {showHideButtons()}
        </div>
      </div>
    </div>
  );
}

export default Home;
