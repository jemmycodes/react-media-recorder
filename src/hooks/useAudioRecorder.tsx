import { useEffect, useRef, useState } from "react";
import { getSupportedMimeType } from "../utilities";

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  error: string | null;
  audioURL: string | null;
  loading: boolean;
  isInitialized: boolean;
}

const defaultState = {
  isRecording: false,
  isPaused: false,
  error: null,
  audioURL: null,
  loading: false,
  isInitialized: false,
};


const useAudioRecorder = (
  streamOptions: MediaStreamConstraints,
  mediaRecorderOptions: MediaRecorderOptions
) => {
  const [state, setState] = useState<RecorderState>(defaultState);

  const [timer, setTimer] = useState(0);

  const audioRecordingRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (state.audioURL) {
        URL.revokeObjectURL(state.audioURL);
      }
    };
  }, [state.audioURL]);

  useEffect(() => {
    if (!state.isRecording || state.isPaused) return;

    const startTime = Date.now() - timer * 1000;

    const timerID = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, [state.isRecording, timer, state.isPaused]);

  const initialize = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, audioURL: null }));
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        streamOptions
      );
      streamRef.current = mediaStream;

      const supportedType = getSupportedMimeType("audio");

      prompt(supportedType);

      if (!supportedType) {
        throw new Error("No supported audio codec found");
      }

      try {
        mediaRecorderRef.current = new MediaRecorder(mediaStream, {
          ...mediaRecorderOptions,
          mimeType: supportedType,
        });
      } catch (e) {
        console.error("MediaRecorder error:", e);
        throw new Error("Failed to create MediaRecorder");
      }

      if (audioRecordingRef.current) {
        audioRecordingRef.current.srcObject = mediaStream;
        audioRecordingRef.current.muted = true; // Mute preview to avoid feedback
      }

      setState((prev) => ({ ...prev, error: null, isInitialized: true }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message,
        isInitialized: false,
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      if (!mediaRecorderRef.current) {
        throw new Error(
          "MediaRecorder not initialized. Call initialize() first."
        );
      }

      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Request data every second to ensure we get regular chunks
      mediaRecorderRef.current.start(1000);
      setState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: (error as Error).message }));
    }
  };

  const stopRecording = async (): Promise<void> => {
    try {
      if (
        !mediaRecorderRef.current ||
        mediaRecorderRef.current.state === "inactive"
      ) {
        throw new Error("No active recording to stop");
      }

      return new Promise((resolve, reject) => {
        if (!mediaRecorderRef.current)
          return reject("MediaRecorder not initialized");

        mediaRecorderRef.current.onstop = () => {
          try {
            const mimeType = mediaRecorderRef.current?.mimeType || "audio/mp4";
            console.log(mimeType);
            const blob = new Blob(chunksRef.current, { type: mimeType });
            const url = URL.createObjectURL(blob);

            // Clean up previous URL
            if (state.audioURL) {
              URL.revokeObjectURL(state.audioURL);
            }

            setState((prev) => ({
              ...prev,
              isRecording: false,
              audioURL: url,
              error: null,
              isInitialized: false,
            }));

            // Reset recording preview
            if (audioRecordingRef.current) {
              audioRecordingRef.current.srcObject = null;
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        mediaRecorderRef.current.stop();
      });
    } catch (error) {
      setState((prev) => ({ ...prev, error: (error as Error).message }));
    }
  };

  const pauseRecording = (): void => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setState((prev) => ({ ...prev, isPaused: true }));
    }
  };

  const resumeRecording = (): void => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setState((prev) => ({ ...prev, isPaused: false }));
    }
  };

  const restartRecording = (): void => {
    if (mediaRecorderRef.current && state.isRecording) {
      stopRecording().then(() => {
        initialize().then(() => {
          startRecording();
        });
      });
    }
  };

  return {
    ...state,
    audioRecordingRef,
    initialize,
    recordingTime: timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    restartRecording,
  };
};
export default useAudioRecorder;
