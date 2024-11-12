import useAudioRecorder from "../hooks/useAudioRecorder";

const streamOptions = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 44100,
    sampleSize: 16,
    channelCount: 2,
  },
};

const mediaRecorderOptions = {
  mimeType: "audio/wav",
};

const Audio = () => {
  const {
    startRecording,
    initialize,
    stopRecording,
    audioRecordingRef,
    recordingTime,
    audioURL,
    pauseRecording,
    resumeRecording,
    error,
    isRecording,
    loading,
    isInitialized,
  } = useAudioRecorder(streamOptions, mediaRecorderOptions);
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

      {audioURL && <audio src={audioURL} autoPlay></audio>}
      {!audioURL && (
        <audio
          ref={audioRecordingRef}
          playsInline
          controls={false}
          autoPlay
          muted
          className="audio"></audio>
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

export default Audio;
