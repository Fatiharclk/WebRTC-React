import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  SocketConnectedActions,
  SocketIDActions,
} from "../../redux/actions/SocketActions/SocketActions";
import { UserNameActions } from "../../redux/actions/UserActions/UserActions";
import { FcConferenceCall } from "react-icons/fc";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Name, setName] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState(false);

  const SendLogin = () => {
    if (!!Name) {
      const socket = io("localhost:8080/webRTCPeers", { path: "/webrtc" });
      //Save to Socket Redux
      dispatch(SocketConnectedActions(socket));
      socket.on("connect", () => {
        socket.emit("login", {
          Name: Name,
          SocketID: socket.id,
        });
        dispatch(SocketIDActions(socket.id));
        //Save to Name
        dispatch(UserNameActions(Name));
        navigate(`/home`);
      });
    } else {
      setErrorMsg(true);
    }
  };

  return (
    <div className="Login-Background">
      <FcConferenceCall className="Login-Icon" size={90} />
      <div className="Login-Header-Text">Wellcome to ChatApp</div>
      <input
        type="text"
        className="Login-Header-Input"
        placeholder="İsim ve Soyisim"
        required=""
        onChange={(e) => setName(e.target.value)}
        value={Name}
      />
      {ErrorMsg && (
        <div className="Login-Error-Msg">
          Lütfen İsim ve Soyisminizi Giriniz
        </div>
      )}
      <button className="Login-Button" onClick={SendLogin}>
        Giriş Yap
      </button>
    </div>
  );
}
