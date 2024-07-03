import React, { useState, useRef } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { authAxios } from "../../utils/api/auth/authApi";

interface VoiceUploaderProps {
  s3Client: S3Client;
  apiEndpoint: string;
  bucketName: string;
  userId: string;
}

export const VoiceUploader: React.FC<VoiceUploaderProps> = ({
  s3Client,
  apiEndpoint,
  bucketName,
  userId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    chunksRef.current = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
      };
      mediaRecorder.start();
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const handleUpload = async () => {
    if (!recordedBlob) return;

    setLoading(true);
    const fileName = `audio/${Date.now()}.webm`;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: recordedBlob,
      ACL: "public-read",
    };

    try {
      // @ts-expect-error disregard
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      console.log("Upload successful");
      await authAxios.post(`${apiEndpoint}/users/${userId || 1}/upload_audio`, {
        audio: fileName,
      });

      alert("Audio uploaded successfully");
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {loading && <CircularProgress />}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          sx={{ mb: 2 }}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </Box>
      {recordedBlob && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={loading}
        >
          Upload Audio
        </Button>
      )}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          {isRecording
            ? "Recording... Press Stop to finish."
            : "Press Start to begin recording."}
        </Typography>
        {recordedBlob && (
          <Typography variant="body2" color="textSecondary">
            A recorded audio is ready for upload.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
