import React, { useState, ChangeEvent } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authAxios } from "../../utils/api/auth/authApi";
import { CircularProgress, Box, Button, TextField } from "@mui/material";

interface VideoUploaderProps {
  s3Client: S3Client;
  apiEndpoint: string;
  bucketName: string;
  userId: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  s3Client,
  apiEndpoint,
  bucketName,
  userId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const fileKey = `videos/${Date.now()}_${selectedFile.name}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: selectedFile,
      ACL: "public-read",
    };

    try {
      // @ts-expect-error disregard
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      console.log("Upload successful");
      await authAxios.post(`${apiEndpoint}/users/${userId || 1}/upload_video`, {
        video: fileKey,
      });

      alert("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setFileName("");
    }
  };

  return (
    <Box sx={{ textAlign: "center", my: 4 }}>
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      <Box>
        <TextField
          type="text"
          value={fileName}
          placeholder="No file chosen"
          sx={{ mb: 2 }}
          disabled
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="video-upload-input"
        />
        <label htmlFor="video-upload-input">
          <Button
            variant="contained"
            component="span"
            color="primary"
            sx={{ mb: 2 }}
          >
            Choose File
          </Button>
        </label>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          Upload Video
        </Button>
      </Box>
    </Box>
  );
};
