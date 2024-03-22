import logo from "/chat.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase"; //import database from firebase
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: textInputValue,
      timestamp: new Date().toISOString()
    });//Input text into Firebase，and record the current date and time 
    setTextInputValue("");//Clear the input
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>
    <p style={{ whiteSpace: 'pre-wrap' }}>
    {message.val.message}{'     '}{new Date(message.val.timestamp).toLocaleString()}</p>
    </li>
  ));

  return (
      <div className="background-image">
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Chatbox</h1>
      <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
  <form onSubmit={writeData}>
    <input
      type="file"
      value={fileInputValue}
      accept=".jpg, .jpeg, .png"
      onChange={(e) => {
        setFileInputFile(e.target.files[0]);
        setFileInputValue(e.target.value);
      }}
      style={{ width: '50%' }} // 设置宽度为100%
    />
    <br />
    <input
      type="text"
      value={textInputValue}
      onChange={(e) => setTextInputValue(e.target.value)}
      placeholder="Type your message here"
      style={{ width: '40%' }} // 设置宽度为100%
    />
    <input
      type="submit"
      value="Send"
      // Disable Send button when text input is empty
      disabled={!textInputValue}
    />
  </form>
  <ol>{messageListItems}</ol>
</div>
   </div>
  );
}

export default App;
