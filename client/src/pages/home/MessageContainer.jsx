import React, { useEffect } from "react";
import User from "./User";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import SendMessage from "./SendMessage";

const MessageContainer = () => {

  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ recieverId: selectedUser?._id }));
    }
  }, [selectedUser]);

  return (
    <>
      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col gap-5">
          <h2>Welcome to GUP SHUP</h2>
          <p className="text-xl">Please select a person to continue your chat!!</p>
          </div>
      ) : (
        <div className="h-screen w-full flex flex-col">
          <div className="p-3 border-b border-b-white/10">
            <User userDetails={selectedUser} />
          </div>

          <div className="h-full overflow-y-auto p-3">
            {messages?.map((messageDetails) => {
              return (
                <Message
                  key={messageDetails?._id}
                  messageDetails={messageDetails}
                />
              );
            })}
          </div>

          <SendMessage />

        </div>
      )}
    </>
  );
};

export default MessageContainer;