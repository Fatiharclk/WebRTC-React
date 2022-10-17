import React from "react";
import { BsFillMicFill, BsFillCameraVideoFill } from "react-icons/bs";
import "./MediaControl.css";
export default function MeadiaControl({ MicMute, CameraMute, mic, camera }) {
  return (
    <div className="Media">
      <BsFillMicFill
        size={35}
        color={mic ? "red" : "green"}
        onClick={MicMute}
      />
      <BsFillCameraVideoFill
        size={35}
        color={camera ? "red" : "green"}
        onClick={CameraMute}
      />
    </div>
  );
}
