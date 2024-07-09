import React from "react";
import { VideoUploader } from "./VideoUploader";
import { VideoList } from "./VideoList";
import { S3Client } from "@aws-sdk/client-s3";
import { Theme, ThemeProvider } from "@mui/material";

type VideoCaptureProps = {
  apiEndpoint: string;
  bucketName: string;
  userId: string;
  s3Client: S3Client;
  theme?: Theme;
};

export const VideoCapture: React.FC<VideoCaptureProps> = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
  theme,
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
  );

  return theme ? (
    <ThemeProvider theme={theme}>{content}</ThemeProvider>
  ) : (
    content
  );
};
