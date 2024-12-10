import React, { useRef, useState } from "react";
import "./UploadFile.scss";
import Button from "../Button/Button";

interface UploadFileProps {
  onFileSelect: (file: FormData) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file); 
      
      try {
        await onFileSelect(formData); 
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("Vui lòng chọn file trước khi gửi!");
    }
  };

  return (
    <div className="modal__file-content">
      <p>Hãy chọn file từ máy tính của bạn.</p>
      <div className="file-upload-container">
        <form className="file-upload-form" onSubmit={handleSubmit} style={{alignItems:"end"}}>
          <input 
            type="file" 
            id="fileInput" 
            onChange={handleFileChange} 
            ref={fileInputRef} 
            style={{ display: 'none' }}
          />
          <label className="label_upload" htmlFor="fileInput">
            <span className="left_content">
              {fileName || "Chưa chọn file"}
            </span>
            <div className="file-select-button right_content">Chọn file</div>
          </label>
          <Button type="submit" style={{marginTop:"1rem", color:"white"}}>Gửi</Button>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
