import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Color } from "./game/Game";
import { Socket } from "socket.io-client";
import {
  availableOpponentsMessage,
  sendCreateGameMessage,
  sendJoinGameMessage,
} from "../message/message";
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

interface HomeProps {
  socket: Socket;
  color: Color;
  setColor: Dispatch<SetStateAction<Color>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

export default function Home({
  socket,
  color,
  setColor,
  username,
  setUsername,
}: HomeProps) {
  const [opponent, setOpponent] = useState<string>("");
  const [availableOpponents, setAvailableOpponents] = useState<string[]>([]);

  useEffect(() => {
    socket.on("AVAILABLE_OPPONENTS", (data: availableOpponentsMessage) => {
      setAvailableOpponents(data.availableOpponents);
    });
  }, [socket]);

  return (
    <div className="home-container">
      <h1 className="title">Grandmaster</h1>
      <div className="container">
        <ControlledInput
          value={username}
          setValue={setUsername}
          placeholder={"Enter username:"}
          className="username-input"
        />
        <div className="row">
          <div className="col-6">
            <h3>Create a new game</h3>
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
                sendCreateGameMessage(socket, username, color);
              }}
            >
              Create a New Game
            </button>
          </div>
          <div className="col-6">
            <h3>Join an existing game</h3>
            <div className="selected-opponent-text">Selected Opponent: <span className="selected-opponent">{opponent}</span></div>
            <OpponentPicker
              availableOpponents={availableOpponents}
              setOpponent={setOpponent}
            />
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                sendJoinGameMessage(socket, username, opponent);
              }}
            >
              Play against a chosen opponent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OpponentPickerProps {
  availableOpponents: string[];
  setOpponent: Dispatch<SetStateAction<string>>;
}

function OpponentPicker({
  availableOpponents,
  setOpponent,
}: OpponentPickerProps) {
  if (availableOpponents.length === 0) {
    return (
      <div>
        <h4>Available opponents:</h4>
        <p>Unfortunately no opponents are currently available!</p>
      </div>
    );
  }
  return (
    <div className="container">
      <h4>Available opponents:</h4>
      <div className="list-group opponent-list">
        {availableOpponents.map((opponent: string) => {
          return (
            <div
              className="list-group-item list-group-item-action available-opponent"
              onClick={() => {
                setOpponent(opponent);
              }}
            >
              {opponent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
