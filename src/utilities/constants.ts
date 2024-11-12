export const videoMimeTypes = {
  ios: [
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=h264,opus",
    "video/webm",
  ],
  macos: [
    "video/mp4;codecs=h264,aac",
    "video/webm;codecs=h264,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ],
  windows: [
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/webm",
  ],
  android: [
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=h264,opus",
    "video/webm",
  ],
  unknown: [
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=h264,opus",
    "video/mp4",
    "video/webm",
  ],
};

export const audioMimeTypes = {
  ios: ["audio/mp4;codecs=mp4a.40.2", "audio/aac", "audio/mpeg", "audio/mp3"],
  macos: [
    "audio/mp4;codecs=mp4a.40.2",
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mpeg",
    "audio/mp3",
  ],
  windows: [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/wav",
    "audio/mpeg",
    "audio/mp3",
  ],
  android: [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mpeg",
    "audio/mp3",
  ],
  unknown: [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
  ],
};
