import React from "react";
import "./DownloadSampleFile.scss"

interface DownloadSampleFileProps {
    onDownload: () => void;
}

const DownloadSampleFile: React.FC<DownloadSampleFileProps> = ({ onDownload }) => {
    return (
        <button onClick={onDownload}>
            <img src="/Tải xuống.svg" alt="Tải xuống" /> Tải mẫu
        </button>
    );
};

export default DownloadSampleFile;
