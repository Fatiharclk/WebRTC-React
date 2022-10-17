import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FcCallback, FcCustomerSupport, FcRefresh } from "react-icons/fc";
import "./UserList.css";
export default function UserList({ Call }) {
  const Socket = useSelector((state) => state.Socket);
  const [userList, setUserList] = useState(null);

  const GetUsers = () => {
    Socket.socket.emit("user-list");
    Socket.socket.on("user-list", (userlist) => {
      setUserList(userlist);
    });
  };

  useEffect(() => {
    GetUsers();
  }, []);

  return (
    <div className="List">
      <div className="List-Title">
        <FcCustomerSupport size={20} /> Kullanıcı Listesi{" "}
        <FcRefresh
          onClick={GetUsers()}
          className="List-Title-Refresh-Icon"
          size={20}
        />
      </div>
      {!!userList ? (
        <>
          {userList.map((user) => {
            if (Socket.socket.id === user.SocketID) {
              return (
                <div className="Users">
                  <div className="User-Title"> {user.Name}</div>
                  <div className="User-Icon">
                    <FcCustomerSupport size={21} />
                  </div>
                </div>
              );
            }
            return (
              <div className="Users">
                <div className="User-Title"> {user.Name}</div>
                <div className="User-Icon">
                  <FcCallback
                    size={25}
                    onClick={() => Call(user.SocketID, user.Name)}
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
