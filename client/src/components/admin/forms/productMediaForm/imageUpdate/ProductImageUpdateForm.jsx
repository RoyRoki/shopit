import React, { useState } from 'react'
import { urls } from '../../../../../util/URLS';
import { FormDataRequest } from '../../../../../helper/AxiosHelper';
import styles from './ProductImageUpdateForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const ProductImageUpdateForm = ({ productId, savedUrls, onComplete }) => {
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
          <div className={styles.upload_demo}>
            Uploading........
          </div>
        )
      }

  return (
    <div className={styles.main_form_wrap}>
      <div className={styles.saved_images}>
        <div className={styles.saved_imgs_wrap}>
          {savedUrls?.map((url, index) => (
            <div key={index} className={styles.saved_img_frame_wrap}>
              <div
                  className={`${styles.saved_img_frame} 
                      ${imagesToRemove.includes(url) ? styles.inactive : styles.active }`
                  }
                  style={{backgroundImage: `url(${url})`}}
                  onClick={() => handleRemoveSavedImages(url)}
              >
                  <div className={styles.remove_btn}>
                    {imagesToRemove.includes(url) ? (
                      <FontAwesomeIcon icon={faTrash}/>
                    ) : (
                      <FontAwesomeIcon icon={faTrashCan}/>
                    )}
                  </div>
               </div>

            </div>
          ))}
        </div>
      </div>

      {/* Upload new images */}
      <div className={styles.upload_wrap}>
        <div className={styles.new_preview_wrap}>
          <div 
            className={styles.input_files_wrap}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <FontAwesomeIcon icon={faPlus} />
          <input 
            id='fileInput'
            type="file"
            multiple
            accept='image/*'
            onChange={(e) => handleFileChange(e)}
            style={{display: 'none'}}
          />
          </div>
          {previewImages.length > 0 && (
            <> 
              {previewImages.map((src, index) => (
                <div 
                  key={index} 
                  className={styles.preview_img_frame}
                  style={{backgroundImage: `url(${src})`}}
                >
                  <div className={styles.prev_rm_btn} onClick={() => handleRemovedSelectedImages(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </div>))
              }
              </>)
            }
        </div>
      </div>
      {/* Submit button */}
      <div className={styles.submit_btn_wrap}>
        <button onClick={handleSubmit}>
          <FontAwesomeIcon icon={faUpload} />
          Update Images
        </button>
      </div>
    </div>
  );
}

export default ProductImageUpdateForm
