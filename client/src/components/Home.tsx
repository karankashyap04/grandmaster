import React, { useState, Dispatch, SetStateAction } from "react";
import { Color } from "./game/Game";
import { Socket } from "socket.io-client";
import { sendCreateRoomMessage } from "../message/message";
import "./styles/Home.css";

interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  className: string;
}

function ControlledInput({
  value,
  setValue,
  placeholder,
  className,
}: ControlledInputProps): JSX.Element {
  return (
    <input
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      placeholder={placeholder}
      className={className}
    ></input>
  );
}

export default function Home({ socket }: { socket: Socket }) {
  const [username, setUsername] = useState<string>("");
  const [color, setColor] = useState<Color>(Color.WHITE);
  return (
    <div className="home-container">
      <h1 className="title">Grandmaster</h1>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h3>Create a new game</h3>
            <ControlledInput
              value={username}
              setValue={setUsername}
              placeholder={"Enter username:"}
              className="username-input"
            />
            <h4>Which color do you want to be?</h4>
            <form className="form-inline">
              <div className="container color-pick">
                <div className="row">
                  <div className="col-6">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="color-input"
                        id="white-input"
                        value="WHITE"
                        onClick={() => {
                          setColor(Color.WHITE);
                        }}
                      />
                      <label className="form-check-label" htmlFor="white-input">
                        White
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="color-input"
                        id="black-input"
                        value="BLACK"
                        onClick={() => {
                          setColor(Color.BLACK);
                        }}
                      />
                      <label className="form-check-label" htmlFor="black-input">
                        Black
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                sendCreateRoomMessage(socket, username, color);
              }}
            >
              Create a New Game
            </button>
          </div>
          <div className="col-6"></div>
        </div>
      </div>
    </div>
  );
}
