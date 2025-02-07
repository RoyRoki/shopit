import React, { useState } from "react";
import styles from "./AddProductForm.module.css";
import { useForm } from "react-hook-form";
import { request } from "../../../../helper/AxiosHelper";
import CategorySelector from "../../../buttons/categorySelector/CategorySelector";
import KeywordsInput from "../../../buttons/keywordsInput/KeywordsInput";
import { urls } from "../../../../util/URLS";

const AddProductForm = ({ onComplete }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      discount: data.discount / 100,
      categoryIds: categories,
      keywords: keywords,
    };
    try {
      const response = await request("POST", urls.AddProduct, requestData);
      if (response.status === 200) {
        onComplete(response.data);
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.main_wrap}>
      <div className={styles.form_wrap}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Product Name</label>
              <input
                type="text"
                {...register("name", {
                  required: "Product name is required.",
                  minLength: {
                    value: 50,
                    message: "Name must be at least 50 characters long.",
                  },
                  maxLength: {
                    value: 200,
                    message: "Name must be less then 150 characters long.",
                  },
                })}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className={styles.form_row}>
            <div className={styles.form_input_box}>
              <label>Description</label>
              <textarea
                type="text"
                {...register("description", {
                  required: "Description is requited.",
                  minLength: {
                    value: 50,
                    message: "Description must be at least 50 characters long.",
                  },
                  maxLength: {
                    value: 500,
                    message:
                      "Description must be less then 250 characters long",
                  },
                })}
              />
              {errors.description && (
                <p className={styles.error}>{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className={styles.form_inline_wrap}>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Prices</label>
                <input
                  type="number"
                  step="1"
                  defaultValue={10}
                  {...register("prices", {
                    required: "Price is required.",
                    min: {
                      value: 10,
                      message: "Price must be at least ₹10.",
                    },
                    max: {
                      value: 100000,
                      message: "Price cannot exceed ₹100,000.",
                    },
                  })}
                />
                {errors.prices && (
                  <p className={styles.error}>{errors.prices.message}</p>
                )}
              </div>
            </div>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Discount In %</label>
                <input
                  type="number"
                  step={1}
                  defaultValue={0}
                  {...register("discount", {
                    min: {
                      value: 0,
                      message: "Discount cannot be less than 0%.",
                    },
                    max: {
                      value: 99,
                      message: "Discount cannot exceed 99%.",
                    },
                  })}
                />
                {errors.discount && (
                  <p className={styles.error}>{errors.discount.message}</p>
                )}
              </div>
            </div>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Stock</label>
                <input 
                  type="number" 
                  min={1} 
                  max={1000}
                  defaultValue={1} 
                  {...register("stock")} 
                />
              </div>
            </div>
          </div>
          <div className={styles.form_row}>
            <span className={styles.discounted_price}>{`Discounted Prices : ₹${(
              watch("prices") *
              (1 - watch("discount") / 100)
            ).toFixed(2)}`}</span>
          </div>
          <div className={styles.form_row}>
            <div className={styles.category_row}>
              <h2>Product Type</h2>
              <CategorySelector onSelect={(arr) => setCategories(arr)} />
            </div>
          </div>
          <div className={styles.form_row}>
            <div className={styles.keyword_row}>
              <h2>Keywords</h2>
              <KeywordsInput onSelect={(words) => setKeywords(words)} />
            </div>
          </div>
          <div className={styles.form_row}>
            <button className={styles.submit_btn} type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
