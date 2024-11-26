import React, { useState } from "react";
import { Form, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export function Content(){
    const [fileList, setFileList] = useState([]);
    const handleFileChange = (info) => {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
    
          // Read the file and log Base64
          const reader = new FileReader();
          reader.readAsDataURL(file);
    
          reader.onload = () => {
            console.log("Base64 Result:", reader.result);
          };
    
          reader.onerror = (error) => {
            console.error("File Reading Error:", error);
          };
    
          // Update the state for controlled file management
          setFileList(info.fileList);
        } else {
          setFileList([]);
        }
      };

      const handleUpload = async()=>{
        const hel = await axios.post('http://localhost:8080/api/seller/upload-image',{fileList})
        console.log(hel)
      }
    return(
        <div>
            <div>Image</div>
            <Form layout="vertical" style={{ maxWidth: "600px", padding: "20px" }}>
      <Form.Item
        name="image"
        label="Product Image"
        rules={[{ required: true, message: "Please upload an image" }]}
      >
        <Upload
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false} // Prevent automatic upload
          onChange={handleFileChange}
          fileList={fileList} // Ensure controlled component behavior
        >
          <Button icon={<UploadOutlined />} onClick={handleUpload}>Click to Upload</Button>
          {fileList || fileList==null?"":<img width={60} height={60} src={fileList}/>}
        </Upload>
      </Form.Item>
    </Form>
        </div>
    )
}