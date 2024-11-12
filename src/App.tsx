import { useState } from "react";
import "./App.css";
import Video from "./components/Video";
import Audio from "./components/Audio";

const App = () => {
  const [action, setAction] = useState<string>("");

  return (
    <div className="app">
      {action === "audio" && <Audio />}
      {action === "video" && <Video />}
      {!action && (
        <>
          <h1>React Video Recorder</h1>
          <div className="call-to-actions">
            <button onClick={() => setAction("audio")}>Record Audio</button>
            <button onClick={() => setAction("video")}>Record Video</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
