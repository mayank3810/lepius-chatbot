import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [messageToSend, setMessageToSend] = useState([])
  const chatRef = useRef(null);

  async function getMessage() {
    setLoadingAi(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": "Given your question or statement, Lepius will provide basic health insurance information, promote Lepius.ai, and encourage you to create an account for detailed and personalized assistance. Anything not related to insurance or Lepius ai reply with 'I specialize in health insurance and Lepius.ai. Would you like assistance with those topics?"
        },
        ...messageToSend
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const resp = await fetch("https://lepius-non-logged-in-mayank.azurewebsites.net/api/chat-completion", requestOptions)
    const aiMessageResp = await resp.text()
    setInputMessage("");
    let mess_ = messageToSend
    mess_.push({
      "role": "assistant",
      "content": aiMessageResp
    })
    setMessageToSend(mess_)
    setLoadingAi(false)
    setInputMessage("")
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }

  function handleChat(e) {

    e.preventDefault()
    let mess_ = messageToSend
    mess_.push({
      "role": "user",
      "content": inputMessage
    })
    setMessageToSend(mess_)
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    console.log(messageToSend)
    getMessage()
  }

  function loader() {
    return (
      <div className="loader"></div>
    )
  }

  return (
    <>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt" /> Lepius
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog" />
            </span>
          </div>
        </header>
        <main ref={chatRef} className="msger-chat">
          {messageToSend.length > 0 && messageToSend.map((message) => (
            <>
              {message?.role === 'user' ? <div key={message?.content.replaceAll(" ", "-").substring(1, 12)} className="msg right-msg">
                <div
                  className="msg-img"
                  style={{
                    backgroundImage:
                      "url(https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg)"
                  }}
                />
                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">User</div>
                  </div>
                  <div className="msg-text">{message?.content}</div>
                </div>
              </div> : <div key={message?.content.replaceAll(" ", "-").substring(1, 12)} className="msg left-msg">
                <div
                  className="msg-img"
                  style={{
                    backgroundImage:
                      "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8oq6xDw2qeWmbZNTvnQuTBiwBknqEMPZlg&s)"
                  }}
                />
                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">BOT</div>
                  </div>
                  <div className="msg-text">
                    {message?.content}
                  </div>
                </div>
              </div>}

            </>

          ))}

          {loadingAi && <div className="msg left-msg">
            <div
              className="msg-img"
              style={{
                backgroundImage:
                  "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8oq6xDw2qeWmbZNTvnQuTBiwBknqEMPZlg&s)"
              }}
            />
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">BOT</div>
              </div>
              <div className="msg-text">
                {loader()}
              </div>
            </div>
          </div>}

        </main>
        <form className="msger-inputarea">
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={handleChat} type="submit" className="msger-send-btn">
            Send
          </button>
        </form>
      </section>

    </>

  );
}

export default App;
