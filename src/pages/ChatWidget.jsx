import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatWidget = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const primaryColor = urlParams.get("primaryColor")?.trim() || "#0675E6";
  const secondaryColor = urlParams.get("secondaryColor")?.trim() || "#FFFFFF";
  const fontFamily = urlParams.get("fontFamily")?.trim() || "Poppins, sans-serif";
  const companionName = urlParams.get("companionName")?.trim() || "Chat Assistant";
  const userId = urlParams.get("user_id")?.trim();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => "sess_" + Math.random().toString(36).substring(2, 10));
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [icebreakers, setIcebreakers] = useState([]);

  useEffect(() => {
    document.body.style.background = "transparent";
  }, []);

  useEffect(() => {
    if (!userId) {
      document.body.innerHTML = `<h3 style="font-family:${fontFamily};text-align:center;margin-top:2rem;">Error: Missing user_id</h3>`;
    }

    document.body.style.fontFamily = fontFamily;

    const handleMessage = (event) => {
      if (event.data === "openChat") setIsOpen(true);
      if (event.data === "closeChat") setIsOpen(false);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [userId, fontFamily]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 80) + "px";
    }
  };

  const appendMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const startChat = async () => {
    if (!userEmail || !acceptTerms) return;

    setHasStartedChat(true);
    setIsTyping(true);

    try {
      const res = await fetch("https://walrus.kalavishva.com/webhook/convox_trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          customer_email: userEmail,
          user_message: "hi", // Don't show this one
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      const reply = data?.[0]?.response;
      const botReply = reply?.response || "Welcome!";
      const quick1 = reply?.quick_reply1;
      const quick2 = reply?.quick_reply2;

      appendMessage("bot", botReply);

      // Show icebreakers if present
      const quickReplies = [];
      if (quick1) quickReplies.push(quick1);
      if (quick2) quickReplies.push(quick2);
      setIcebreakers(quickReplies);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      appendMessage("bot", "Error contacting server.");
    }
  };

  const handleSend = async (overrideText) => {
    const message = (overrideText ?? input).trim();
    if (!message) return;
    setIcebreakers([]);

    appendMessage("user", message);
    setInput("");
    adjustHeight();
    setIsTyping(true);

    try {
      const res = await fetch("https://walrus.kalavishva.com/webhook/convox_trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          timestamp: new Date().toLocaleString("en-GB"),
          user_message: message,
        }),
      });

      const data = await res.json();
      setIsTyping(false);
      console.log("Response from server:", data);

      const reply = data?.[0]?.response;
      const botReply = reply?.response || "Sorry, something went wrong.";
      const quick1 = reply?.quick_reply1;
      const quick2 = reply?.quick_reply2;

      appendMessage("bot", botReply);

      const quickReplies = [];
      if (quick1) quickReplies.push(quick1);
      if (quick2) quickReplies.push(quick2);
      setIcebreakers(quickReplies);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      appendMessage("bot", "Error contacting server.");
    }
  };

  return (
    <div
      className={`fixed bottom-[90px] right-3 w-[90%] sm:w-[370px] h-[70vh] rounded-2xl overflow-hidden flex flex-col shadow-lg z-[998] transition-all duration-300 ${
        isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: secondaryColor }}
    >
      {/* Header */}
      <div
        className="h-16 text-white flex flex-col justify-center px-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          <h1>{companionName}</h1>
          <p className="text-xs text-100">Powered By ConvoX</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {!hasStartedChat ? (
          <div className="flex flex-col gap-3 text-sm text-black">
            <p>Hi there 👋</p>
            <p>Please introduce yourself:</p>
            <input
              type="email"
              placeholder="Your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="outline p-2 rounded-md text-black"
            />
            <label className="flex items-center gap-2 text-xs text-black">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
              />
              I understand that {companionName} is responsible for handling my conversation data. I agree that this data may be used and shared in line with GDPR (General Data Protection Regulation) rules.
            </label>
            <button
              onClick={startChat}
              className="px-4 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: primaryColor }}
              disabled={!userEmail || !acceptTerms}
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${
                  msg.from === "user" ? "self-end text-white" : "self-start bg-gray-100 text-black"
                } max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed`}
                style={msg.from === "user" ? { backgroundColor: primaryColor } : {}}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {icebreakers.length > 0 && (
              <div className="flex flex-col gap-2">
                {icebreakers.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput("");
                      setIcebreakers([]);
                      handleSend(text);
                    }}
                    className="self-end px-4 py-2 rounded-2xl border border-gray-300 text-sm"
                    style={{
                      backgroundColor: "transparent",
                      color: "#000",
                      borderColor: "#ccc",
                    }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
            {isTyping && (
              <div className="self-start bg-gray-100 px-3 py-1.5 rounded-xl text-xs animate-pulse text-black">
                typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {hasStartedChat && (
        <div
          className="flex gap-2 items-center p-2 border-t border-gray-300"
          style={{ backgroundColor: secondaryColor }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="How can we help you today..."
            rows={1}
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none resize-none overflow-y-auto text-black placeholder-gray-500"
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={() => handleSend()}
            className="w-10 h-10 text-white text-lg rounded-full flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <svg
              width="19px"
              height="19px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
