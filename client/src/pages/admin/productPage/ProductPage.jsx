import React, { useEffect, useState } from 'react'
import styles from './ProductPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AddProductForm from '../../../components/admin/forms/addProduct/AddProductForm';
import { adminEditProduct, adminHeroDiv, adminProductPageState } from '../../../util/HERODIV';
import EditProductForm from '../../../components/admin/forms/editproduct/EditProductForm';
import ShowAllProducts from '../../../components/admin/showAllProducts/ShowAllProducts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreProducts } from '../../../features/admin/storeProductsSlice';
import AdminHeroProduct from '../../../components/admin/cards/heroProduct/AdminHeroProduct';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProductPage = ({ store, state }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState(state || adminProductPageState.allProducts);
  const [editProduct, setEditProduct] = useState(null);
  const [isMediaEdit, setIsMediaEdit] = useState(false);
  const [heroProduct, setHeroProduct] = useState(null);

  const {products, error, loading} = useSelector((state) => state.storeProducts);

  useEffect(() => {
        const fetchProducts = async () => {
              dispatch(fetchStoreProducts());
        }
        fetchProducts();
  }, [dispatch, pageState, store]);

  const handleAddProduct = async (product) => {
    setEditProduct(product);
  }

  const handleProductEdit = (product) => {
    setEditProduct(product);
  }

  const handleMediaEdit = (product) => {
    setEditProduct(product);
    setPageState(adminProductPageState.editProduct);
    setIsMediaEdit(true);
  }

  const handleShowHero = (product) => {
    setHeroProduct(product);
    setPageState(adminProductPageState.heroProduct);
  }

  const handleProductDelete = () => {
    dispatch(fetchStoreProducts());
    setPageState(adminProductPageState.allProducts);
  }

  useEffect(() => {
    if(editProduct) {
      setPageState(adminProductPageState.editProduct);
    }
  }, [editProduct]);

  return (
    <div className={styles.main_page}>
      <div className={styles.action_wrap}>
        <div 
          className={`${styles.action_btn} ${pageState === adminProductPageState.allProducts && styles.action_btn_active}`}
          onClick={() => {setPageState(adminProductPageState.allProducts); setIsMediaEdit(false)}}
        >
          <FontAwesomeIcon icon={faBoxes}/>
          Products
        </div>
        <div 
          className={`${styles.action_btn} ${pageState === adminProductPageState.addNewProduct && styles.action_btn_active}`}
          onClick={() => setPageState(adminProductPageState.addNewProduct)}
        >
          <FontAwesomeIcon icon={faPlusCircle}/>
          Add New Products
        </div>
      </div>
      <div className={styles.hero_section}>
          {pageState === adminProductPageState.addNewProduct && (
            <AddProductForm onComplete={(product) => handleAddProduct(product)} />
          )}
          {pageState === adminProductPageState.editProduct && (
            <EditProductForm 
                product={editProduct}  
                onComplete={() => setPageState(adminProductPageState.allProducts)}
                state={!isMediaEdit ? adminEditProduct.basic : adminEditProduct.media}
            />
          )}
          {pageState === adminProductPageState.allProducts && (
            <>
            {!loading ? (
              <ShowAllProducts products={products} onProductEdit={handleProductEdit} onMediaEdit={handleMediaEdit} showHero={handleShowHero} />
            ) : (
              <div className={styles.demo_products_wrap}>
                <div className={styles.demo_product}></div>
                <div className={styles.demo_product}></div>
                <div className={styles.demo_product}></div>
              </div>
            )}
            </>
          )}
          {pageState === adminProductPageState.heroProduct && (
            <AdminHeroProduct product={heroProduct} onDelete={handleProductDelete} onEdit={handleProductEdit} onMediaEdit={handleMediaEdit} />
          )}
      </div>
    </div>
  )
}

export default ProductPage
