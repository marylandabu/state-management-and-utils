import React, { useState, ChangeEvent, useEffect } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authAxios } from "../../utils/api/auth/authApi";
import {
  CircularProgress,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import EXIF from "exif-js";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [metadataList, setMetadataList] = useState<unknown[]>([]);
  const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);

  useEffect(() => {
    // Fetch folders for the user
    authAxios
      .get(`${apiEndpoint}/users/${userId}/folders`)
      .then((response) => {
        setFolders(response.data.folders);
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  }, [userId, apiEndpoint]);

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

          console.log(`Upload successful for file ${file.name}`);
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

      alert("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
    } finally {
      setLoading(false);
      setSelectedFiles([]);
      setFileNames([]);
      setMetadataList([]);
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
          value={fileNames.join(", ")}
          placeholder="No files chosen"
          sx={{ mb: 2 }}
          disabled
          fullWidth
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload-input"
          multiple
          // @ts-expect-error disregard for now
          webkitdirectory="true"
          directory="true"
        />
        <label htmlFor="file-upload-input">
          <Button
            variant="contained"
            component="span"
            color="primary"
            sx={{ mb: 2 }}
          >
            Choose Folder
          </Button>
        </label>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value as number)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>Root</em>
          </MenuItem>
          {folders.map((folder) => (
            <MenuItem key={folder.id} value={folder.id}>
              {folder.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || loading}
        >
          Upload Files
        </Button>
      </Box>
    </Box>
  );
};
