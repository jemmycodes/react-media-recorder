import useVideoRecorder from "../hooks/useVideoRecorder";

const streamOptions = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    channelCount: 2,
  },
};

const mediaRecorderOptions = {
  mimeType: "video/mp4;codecs=h264,aac",
};

const Video = () => {
  const {
    startRecording,
    initialize,
    stopRecording,
    videoRecordingRef,
    recordingTime,
    videoURL,
    pauseRecording,
    resumeRecording,
    error,
    
    isRecording,
    loading,
    isInitialized,
  } = useVideoRecorder(streamOptions, mediaRecorderOptions);
  return (
    <>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!!recordingTime && isRecording && (
        <div className="recording">
          <p>Recording Time: </p>
          <p>{recordingTime} secs</p>
        </div>
      )}

      {videoURL && (
        <video src={videoURL} height={360} width={360} autoPlay></video>
      )}
      {!videoURL && (
        <video
          ref={videoRecordingRef}
          playsInline
          controls={false}
          autoPlay
          muted
          className="video"></video>
      )}

      <div className="call-to-actions">
        {!isRecording && isInitialized && (
          <button onClick={startRecording}>Start</button>
        )}
        {!isInitialized && <button onClick={initialize}>Initialize</button>}
        {isRecording && isInitialized && (
          <button onClick={stopRecording}>Stop</button>
        )}
        {isInitialized && isRecording && (
          <>
            <button onClick={pauseRecording}>Pause</button>
            <button onClick={resumeRecording}>Resume</button>
          </>
        )}
      </div>
    </>
  );
};

export default Video;
