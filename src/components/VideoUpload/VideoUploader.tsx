// components/VideoUploader.js
import React, { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import LoadingSpinner from "../LoadingSpinner";
import { authAxios } from "../../utils/api/auth/authApi";

const VideoUploader = ({
  s3Client,
  apiEndpoint,
  bucketName,
  userId,
}: {
  s3Client: S3Client;
  apiEndpoint: string;
  bucketName: string;
  userId: string;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const fileName = `videos/${Date.now()}_${selectedFile.name}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: selectedFile,
      ACL: "public-read",
    };

    try {
      // @ts-expect-error disregard
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      console.log("Upload successful");
      await authAxios.post(`${apiEndpoint}/users/${userId || 1}/upload_video`, {
        video: fileName,
      });

      alert("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        Upload Video
      </button>
    </div>
  );
};

export default VideoUploader;
