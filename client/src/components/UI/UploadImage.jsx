import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { UPLOAD_USER_AVATAR_API } from "../../apiDetails";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  try {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  } catch (e) {
    message.error(e.message);
  }
};

const UploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { id, avatar } = useSelector((state) => state.userData);

  const uploadUserAvatarApi = async (payload) => {
    console.log(payload);
    try {
      const response = await axios.post(UPLOAD_USER_AVATAR_API, payload, {
        withCredentials: true,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (info) => {
    try {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
          const payload = { avatarFile: url, id };
          uploadUserAvatarApi(payload);
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    if (avatar) {
      setImageUrl(avatar.secure_url);
    }
  }, );

  return (
    <ImgCrop modalOk="Upload" cropShape="round" foo>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" className="rounded-full" />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};
export default UploadImage;
