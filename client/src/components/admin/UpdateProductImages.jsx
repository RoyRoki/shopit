import React, { useState } from 'react'
import ToggleButton from '../ToggleButton';
import { FormDataRequest, request } from '../../helper/AxiosHelper';
import { urls } from '../../util/URLS';

const UpdateProductImages = ({ productId, savedUrls, onComplete }) => {
      const [imagesToRemove, setImagesToRemove] = useState([]);
      const [selectedFiles, setSelectedFiles] = useState([]);
      const [previewImages, setPreviewImages] = useState([]);
      const [uploading, setUploading] = useState(false);

      const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newUrls = files.map((file) => URL.createObjectURL(file));

        const handleChange = async () => {
          setSelectedFiles((prev) => [...prev, ...files]);
          setPreviewImages((prev) => [...prev, ...newUrls]);
        } 
        handleChange();
        console.log([...previewImages, ...newUrls]);
      };

      // Remove from selected files to be upload
      const handleRemovedSelectedImages = async (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      };

      // Remove from saved images
      const handleRemoveSavedImages = (url) => {
        if(!imagesToRemove.includes(url)) {
          setImagesToRemove((prev) => [...prev, url]);
        } else {
          // Toggle
          setImagesToRemove((prev) => prev.filter((img) => img !== url));
        }
      };

      const handleSubmit = async () => {
        setUploading(true);
          if(selectedFiles.length !== 0) {
            // Upload New Files
            const formData = new FormData();
            formData.append("product-id", productId);
            selectedFiles.forEach((file) => {
              formData.append("images", file);
            });

            try {
              const response = await FormDataRequest("POST", urls.uploadProductImage, formData);
              console.log(response);
              
            } catch (error) {
              console.error(error);
              setUploading(false);
              return;
            }
          }
          if(imagesToRemove.length !== 0) {
            try {
              const response = await request("POST", `${urls.removeProductImageWithId}${productId}`, imagesToRemove);
              console.log(response);

            } catch (error) {
              console.error(error);
              setUploading(false);
              return;
            }
          }
          
          setUploading(false);
          onComplete();

      }
      if(uploading) {
        return (
          <div>
            <h1>Uploading ..... .. . . . . .. . . . .</h1>
          </div>
        )
      }

  return (
    <div>
      <h1>Update Images For Product Id: {productId}</h1>
      {/*Display existing images */}
      <div>
        <h3>Saved Images: </h3>
        <div>
          {savedUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Image: ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <ToggleButton toggle={imagesToRemove.includes(url)} setToggle={() => handleRemoveSavedImages(url)} forFalseText={"Remove"} forTrueText={"Undo"} />
            </div>
          ))}
        </div>
      </div>

      {/* Upload new images */}
      <div>
        <h2>Upload new images</h2>
        <input 
          type="file"
          multiple
          accept='image/*'
          onChange={(e) => handleFileChange(e)}/>
        
        <div>
          <h3>Preview Images: </h3>
          {previewImages.length > 0 && (
            <div style={{ position: 'relative' }}> 
              {previewImages.map((src, index) => (
                <div key={index}>
                  <img src={src} alt={`Image: ${index+1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                  <button onClick={() => handleRemovedSelectedImages(index)}>Remove</button> 
                </div>))
              }
              </div>)
            }
        </div>
      </div>
      {/* Submit button */}
      <div>
        <button onClick={handleSubmit}>Update Images</button>
      </div>
    </div>
  );
};

export default UpdateProductImages
