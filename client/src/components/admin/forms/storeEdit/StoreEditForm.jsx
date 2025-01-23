import React, { useState } from "react";
import styles from "./StoreEditForm.module.css";
import { useForm } from "react-hook-form";
import { FormDataRequest, request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import CategorySelector from "../../../buttons/categorySelector/CategorySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRefresh, faUpload } from "@fortawesome/free-solid-svg-icons";

const StoreEditForm = ({ store, onUpdate }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(
    store.categories.map((category) => category.id)
  );

  const onSubmit = async (data) => {
    setUploading(true);

    try {
      const response = await request("POST", urls.updateStore, {
        ...data,
        categoryIds: selectedCategories,
      });
      if (response.status === 200) {
        // Now upload logo banner
        if(logo !== null || banner !== null) {
          handleUpload();
        } else {
          setUploading(false);
          onUpdate();
        }
      }
    } catch (error) {
      console.log(error);
      uploading(false);
    }
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);
  };

  const handleUpload = async () => {

    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('banner', banner);
    formData.append('storeId', store.id);

    try {
      const response = await FormDataRequest("POST", urls.updateLogoBanner, formData);
    } catch(error) {
      console.log(error);
    }
    setUploading(false);
    onUpdate();
  }

  return (
    <div className={styles.main_wrap}>
      {uploading && (<div className={styles.overlay}></div>)}
      <div className={`${styles.form_wrap} ${uploading ? styles.uploading_wrap : ''}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Store Name</label>
              <input
                type="text"
                {...register("name")}
                defaultValue={store.name}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Description</label>
              <textarea
                type="text"
                {...register("description")}
                defaultValue={store.description}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Store's Email</label>
              <input
                type="text"
                {...register("email")}
                defaultValue={store.email}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Store's Mobile NO</label>
              <input
                type="text"
                {...register("mobileNo")}
                defaultValue={store.mobileNO}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Shipping Type</label>
              <input type="text" value={"SELF"} {...register("shippingType")} />
            </div>
          </div>

          <div className={styles.category_row}>
            <h2>Store Type</h2>
            <CategorySelector
              onSelect={(arr) => setSelectedCategories(arr)}
              initialSelectedCategories={selectedCategories}
            />
          </div>

          <hr />

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>HouseNo</label>
              <input
                type="text"
                {...register("houseNo")}
                defaultValue={store.houseNo}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Street</label>
              <input
                type="text"
                {...register("street")}
                defaultValue={store.street}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>City</label>
              <input
                type="text"
                {...register("city")}
                defaultValue={store.city}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>State</label>
              <input
                type="text"
                {...register("state")}
                defaultValue={store.state}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>PinCode</label>
              <input
                type="text"
                {...register("pinCode")}
                defaultValue={store.pinCode}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Landmark</label>
              <input
                type="text"
                {...register("landmark")}
                defaultValue={store.landmark}
              />
            </div>
          </div>

          <hr />

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Header Line</label>
              <input
                type="text"
                {...register("header")}
                defaultValue={store.header}
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>About</label>
              <input
                type="text"
                {...register("about")}
                defaultValue={store.about}
              />
            </div>
          </div>

          <div className={styles.img_upload_wrap}>
            <div className={styles.upload_logo}>
              <span>
                 <span>Change Store's Logo </span>
                {logo && (
                  <FontAwesomeIcon 
                    icon={faRefresh}
                    onClick={(e) =>{e.preventDefault(); setLogo(null)}}
                  />
                )}
              </span>
                  <div className={styles.logo_preview}>
                    <div 
                      className={styles.logo_frame}
                      style={{backgroundImage: `url(${!logo ? store.logoUrl : URL.createObjectURL(logo)})`}}
                      onClick={() => document.getElementById('logoInput').click()}
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </div>
                  </div>
                  <input 
                        id="logoInput"
                        type="file" 
                        onChange={handleLogoChange}
                        accept="image/*"
                        style={{display: 'none'}}
                  />
            </div>
            <div className={styles.upload_banner}>
              <span>
                 <span>Change Store's Banner </span>
                {banner && (
                  <FontAwesomeIcon 
                    icon={faRefresh}
                    onClick={(e) =>{e.preventDefault(); setBanner(null)}}
                  />
                )}
              </span>
                  <div className={styles.banner_preview}>
                    <div 
                      className={styles.banner_frame}
                      style={{backgroundImage: `url(${!banner ? store.bannerUrl : URL.createObjectURL(banner)})`}}
                      onClick={() => document.getElementById('bannerInput').click()}
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </div>
                  </div>
                  <input 
                        id="bannerInput"
                        type="file" 
                        onChange={handleBannerChange}
                        accept="image/*"
                        style={{display: 'none'}}
                  />
            </div>
          </div>

          <div className={styles.action_box}>
            <button type="submit">
              <span>
                Update
              </span>
              <FontAwesomeIcon icon={faUpload}/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreEditForm;
