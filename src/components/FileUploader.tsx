import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { LoadingSpinner } from "./LoadingSpinner";

type FileUploaderProps = {
  s3Client: S3Client;
  bucketName: string;
  onUploadSuccess: (fileKey: string) => void;
  uploadPath?: string;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  s3Client,
  bucketName,
  onUploadSuccess,
  uploadPath = "uploads",
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
    const fileName = `${uploadPath}/${Date.now()}_${selectedFile.name}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: selectedFile,
      ACL: "public-read",
    };

    try {
      //@ts-expect-error irrelevant
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      onUploadSuccess(fileName);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      <input type="file" accept="*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        Upload File
      </button>
    </div>
  );
};

export default FileUploader;
