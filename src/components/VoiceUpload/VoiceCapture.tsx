import { VoiceUploader } from "./VoiceUploader";
import { VoiceList } from "./VoiceList";
import { getConfig } from "../../utils/api/auth/config";
import { ThemeProvider } from "@mui/material";
import { FileUploadS3Props } from "../../utils/types/weatherTypes";

export const VoiceCapture = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
}: FileUploadS3Props) => {
  const content = (
      <div className="my-8">
        <VoiceUploader
          s3Client={s3Client}
          apiEndpoint={apiEndpoint}
          bucketName={bucketName}
          userId={userId}
        />
        <VoiceList apiEndpoint={apiEndpoint} userId={userId} />
      </div>
    ),
    { theme } = getConfig();

  return theme ? (
    <ThemeProvider theme={theme}>{content}</ThemeProvider>
  ) : (
    content
  );
};
