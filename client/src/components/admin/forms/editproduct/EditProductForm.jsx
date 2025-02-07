import React, { useState } from "react";
import styles from "./EditProductForm.module.css";
import {
  adminEditProduct,
  adminProductPageState,
} from "../../../../util/HERODIV";
import { useForm } from "react-hook-form";
import CategorySelector from "../../../buttons/categorySelector/CategorySelector";
import KeywordsInput from "../../../buttons/keywordsInput/KeywordsInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faLeftLong,
  faRightLong,
  faRing,
} from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import InfoTableInput from "../infoTableInput/InfoTableInput";
import ProductMediaForm from "../productMediaForm/ProductMediaForm";

const EditProductForm = ({ product, onComplete, state }) => {
  const [formState, setFormState] = useState(state || adminEditProduct.basic);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState(
    product.categories?.map((category) => category.id) || []
  );
  const [keywords, setKeywords] = useState(
    product.keywords?.map((keyword) => keyword.word) || null
  );
  const [isActive, setIsActive] = useState(product.isActive || false);
  const [tableData, setTableData] = useState(
    product.tableDto || { headers: [], rows: [] }
  );

  const onSubmitInfo = async (data) => {
    const requestData = {
      ...data,
      categoryIds: categories,
      keywords: keywords,
      isActive: isActive,
      table: tableData,
      prices: parseFloat(data.prices),
      discount: parseFloat(data.discount / 100),
      stock: parseInt(data.stock),
      length: parseFloat(data.length),
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
    };

    try {
      const response = await request(
        "PUT",
        `${urls.updateProductWithId}${product.id}`,
        requestData
      );
      console.log(response);
      if (response.status === 200) {
        setFormState(adminEditProduct.media);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className={styles.main_wrap}>
      <div className={styles.header_wrap}>
        <span>Update Product Id : {product.id}</span>
      </div>
      <div className={styles.form_wrap}>
        <form onSubmit={handleSubmit(onSubmitInfo)}>
          <div
            className={styles.step1_basic}
            style={{
              display: `${
                formState === adminEditProduct.basic ? "block" : "none"
              }`,
            }}
          >
            <div className={styles.basic_form_wrap}>
              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>Product Name</label>
                  <input
                    type="text"
                    defaultValue={product.name || ""}
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
                    defaultValue={product.description || ""}
                    {...register("description", {
                      required: "Description is requited.",
                      minLength: {
                        value: 50,
                        message:
                          "Description must be at least 50 characters long.",
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
                      min={10}
                      max={1000000}
                      {...register("prices")}
                      defaultValue={product.prices || 0}
                    />
                  </div>
                </div>
                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Discount In %</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      {...register("discount")}
                      defaultValue={product.discount * 100 || 0}
                    />
                  </div>
                </div>
                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Stock</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      {...register("stock")}
                      defaultValue={product.stock || 0}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.form_row}>
                <span
                  className={styles.discounted_price}
                >{`Discounted Prices : ₹${(
                  watch("prices") *
                  (1 - watch("discount") / 100)
                ).toFixed(2)}`}</span>
              </div>
              <div className={styles.form_row}>
                <div className={styles.category_row}>
                  <h2>Product Type</h2>
                  <CategorySelector
                    onSelect={(arr) => setCategories(arr)}
                    initialSelectedCategories={categories}
                  />
                </div>
              </div>
              <div className={styles.form_row}>
                <div className={styles.keyword_row}>
                  <h2>Keywords</h2>
                  <KeywordsInput
                    onSelect={(words) => setKeywords(words)}
                    initialSelectedKeywords={keywords}
                  />
                </div>
              </div>
              <div className={styles.form_row}>
                <button
                  className={styles.next_btn}
                  onClick={(e) => {
                    e.preventDefault();
                    setFormState(adminEditProduct.other);
                  }}
                >
                  Next <FontAwesomeIcon icon={faRightLong} />
                </button>
              </div>
            </div>
          </div>
          <div
            className={styles.step2_other}
            style={{
              display: `${
                formState === adminEditProduct.other ? "block" : "none"
              }`,
            }}
          >
            <div className={styles.other_form_wrap}>
              <div className={styles.form_row}>
                <div className={styles.active_input}>
                  <span>
                    Status :{" "}
                    {isActive ? (
                      <span className={styles.active}>Active</span>
                    ) : (
                      <span className={styles.inactive}>InActive</span>
                    )}
                  </span>
                  <div
                    className={styles.active_info}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsActive(!isActive);
                    }}
                  >
                    {isActive ? (
                      <span className={styles.inactive}>
                        Set InActive <FontAwesomeIcon icon={faCircle} />
                      </span>
                    ) : (
                      <span className={styles.active}>
                        Set Active <FontAwesomeIcon icon={faCircle} />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>Material</label>
                  <input
                    type="text"
                    maxLength={150}
                    {...register("material", {
                      required: "Material is required.",
                      minLength: {
                        value: 8,
                        message: "Material must be at least 8 character long.",
                      },
                    })}
                    defaultValue={product.material || ""}
                  />
                  {errors.material && (
                    <p className={styles.error}>{errors.material.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_inline_wrap}>
                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Length {`(cm)`}</label>
                    <input
                      type="number"
                      step={"1"}
                      min={0}
                      max={1000}
                      {...register("length", {
                        required: "Length is required.",
                      })}
                      defaultValue={product.length || 0}
                    />
                    {errors.length && (
                      <p className={styles.error}>{errors.length.message}</p>
                    )}
                  </div>
                </div>

                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Width {`(cm)`}</label>
                    <input
                      type="number"
                      step={"1"}
                      min={0}
                      max={1000}
                      {...register("width", {
                        required: "Width is required.",
                      })}
                      defaultValue={product.width || 0}
                    />
                    {errors.width && (
                      <p className={styles.error}>{errors.width.message}</p>
                    )}
                  </div>
                </div>

                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Height {`(cm)`}</label>
                    <input
                      type="number"
                      step={"1"}
                      min={0}
                      max={1000}
                      {...register("height", {
                        required: "Height is required.",
                      })}
                      defaultValue={product.height || 0}
                    />
                    {errors.height && (
                      <p className={styles.error}>{errors.height.message}</p>
                    )}
                  </div>
                </div>

                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <label>Weight {`(g)`}</label>
                    <input
                      type="number"
                      step={"1"}
                      min={0}
                      max={1000000}
                      {...register("weight", {
                        required: "Weight is required."
                      })}
                      defaultValue={product.weight || 0}
                    />
                    {errors.weight && (
                      <p className={styles.error}>{errors.weight.message}</p>
                    )}                    
                  </div>
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.table_wrap}>
                  <h2>Product Type</h2>
                  <InfoTableInput
                    tableDto={product.tableDto || null}
                    onComplete={(table) => {
                      setTableData(table);
                    }}
                    key={product.id}
                  />
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.action_wrap}>
                  <button
                    className={styles.back_btn}
                    onClick={(e) => {
                      e.preventDefault();
                      setFormState(adminEditProduct.basic);
                    }}
                  >
                    <FontAwesomeIcon icon={faLeftLong} /> back
                  </button>

                  <button className={styles.info_submit_btn} type="submit">
                    Update And Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {formState === adminEditProduct.media && (
          <div className={styles.media_form_wrap}>
            <ProductMediaForm onComplete={onComplete} product={product} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductForm;
