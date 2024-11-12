import { audioMimeTypes, videoMimeTypes } from "./constants";

export const createBlob = (
  recordedChunks: BlobPart[],
  options: BlobPropertyBag
) => {
  if (!recordedChunks.length) {
    return { blob: null, url: null };
  }

  const blob = new Blob(recordedChunks, options);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

const detectPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    return "ios";
  } else if (
    userAgent.includes("mac os") &&
    !userAgent.includes("iphone") &&
    !userAgent.includes("ipad")
  ) {
    return "macos";
  } else if (userAgent.includes("windows")) {
    return "windows";
  } else if (userAgent.includes("android")) {
    return "android";
  }
  return "unknown";
};

// Get supported MIME type based on platform
export const getSupportedMimeType = (type: "audio" | "video"): string => {
  const platform = detectPlatform();
  console.log("Detected platform:", platform);

  // Different MIME types to try for different platforms

  const availableMimeType = type === "audio" ? audioMimeTypes : videoMimeTypes;

  const platformTypes =
    availableMimeType[platform] || availableMimeType.unknown;

  const supportedType = platformTypes.find((type) =>
    MediaRecorder.isTypeSupported(type)
  );

  if (!supportedType) {
    throw new Error("No supported video codec found for this device");
  }

  console.log("Selected MIME type:", supportedType);
  return supportedType;
};
