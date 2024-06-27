import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

type FileListProps = {
  files: string[];
  loading: boolean;
  renderFile: (fileUrl: string, index: number) => React.ReactNode;
};

const FileList: React.FC<FileListProps> = ({ files, loading, renderFile }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length > 0 ? files.map(renderFile) : <p>No files found.</p>}
      </div>
    </div>
  );
};

export default FileList;
