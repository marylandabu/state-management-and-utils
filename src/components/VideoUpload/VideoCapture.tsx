import React from "react";
import { VideoUploader } from "./VideoUploader";
import { VideoList } from "./VideoList";
import { getConfig } from "../../utils/api/auth/config";
import { FileUploadS3Props } from "../../utils/types/weatherTypes";
import { ThemeProvider } from "@mui/material";

export const VideoCapture: React.FC<FileUploadS3Props> = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
}) => {
  const content = (
      <div className="my-8">
        <VideoUploader
          s3Client={s3Client}
          apiEndpoint={apiEndpoint}
          bucketName={bucketName}
          userId={userId}
        />
        <VideoList apiEndpoint={apiEndpoint} userId={userId} />
      </div>
    ),
    { theme } = getConfig();
  return theme ? (
    <ThemeProvider theme={theme}>{content}</ThemeProvider>
  ) : (
    content
  );
};
