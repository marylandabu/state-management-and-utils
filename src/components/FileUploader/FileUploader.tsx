import React, { useState, ChangeEvent } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authAxios } from "../../utils/api/auth/authApi";
import {
  CircularProgress,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import EXIF from "exif-js";
import useStore from "./store";

interface FileUploaderProps {
  s3Client: S3Client;
  apiEndpoint: string;
  bucketName: string;
  userId: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  s3Client,
  apiEndpoint,
  bucketName,
  userId,
}) => {
  const { folders, setFiles } = useStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [metadataList, setMetadataList] = useState<unknown[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      setFileNames(filesArray.map((file) => file.name));
      filesArray.forEach((file) => extractMetadata(file));
    }
  };

  const extractMetadata = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        if (buffer) {
          // @ts-expect-error disregard
          EXIF.getData(buffer, function () {
            // @ts-expect-error disregard
            const allMetaData = EXIF.getAllTags(this);
            setMetadataList((prevMetadata) => [...prevMetadata, allMetaData]);
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setMetadataList((prevMetadata) => [...prevMetadata, {}]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);

    try {
      await Promise.all(
        selectedFiles.map(async (file, index) => {
          const fileKey = `uploads/${Date.now()}_${file.name}`;
          const uploadParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: file,
            ACL: "public-read",
          };

          // @ts-expect-error disregard
          const command = new PutObjectCommand(uploadParams);
          await s3Client.send(command);

          await authAxios.post(
            `${apiEndpoint}/users/${userId || 1}/upload_file`,
            {
              file: fileKey,
              metadata: metadataList[index],
              parent_folder_id: selectedFolder,
            }
          );
        })
      );

      const response = await authAxios.get(
        `${apiEndpoint}/users/${userId}/files`
      );
      setFiles(response.data.files);

      setSelectedFiles([]);
      setFileNames([]);
      setMetadataList([]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input">
        <Button variant="contained" component="span">
          Select Files
        </Button>
      </label>
      {fileNames.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Selected Files:</Typography>
          <ul>
            {fileNames.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </Box>
      )}
      <Box mt={2}>
        <Typography variant="h6">Upload to Folder:</Typography>
        <Select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(Number(e.target.value))}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Folder
          </MenuItem>
          {folders.map((folder) => (
            <MenuItem key={folder.id} value={folder.id}>
              {folder.original_filename}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUploader;
