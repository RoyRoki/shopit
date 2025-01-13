import React, { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../context';
import styles from './UserHomePage.module.css'
import { role } from '../../../util/ROLE';

import Navber from '../../../components/home/navber/Navber'
import DefaultContainer from '../../../components/home/DefaultContainer/DefaultContainer';
import ProductsByKeyword from '../../../components/home/productsByKeyword/ProductsByKeyword';
import HeroProduct from '../../../components/home/heroProduct/HeroProduct';
import ProductsByQuery from '../../../components/home/productByQuery/ProductsByQuery';
import ProductsByCategory from '../../../components/home/productsByCategory/ProductsByCategory';
import StorePublicPage from '../../../components/store/publicPage/StorePublicPage';

const UserHomePage = () => {
      const { auth } = useContext(AuthContext);
      const [searchParams] = useSearchParams();

      // Get the specific container
      const key = searchParams.get('key');
      const query = searchParams.get('query');
      const category_id = searchParams.get('category_id');
      const product_id = searchParams.get('product_id');
      const store_id = searchParams.get('store_id');

      const navigate = useNavigate();
  return (
            <div className={styles.main}>
                  <Navber isLogged={auth.profileMode === role.user} />
                  <div className={styles.main_container}>
                        {/* Products show by keyword */}
                        {key && (
                              <ProductsByKeyword keyword={key} />
                        )}

                        {/* Products show by Search query */}
                        {query && (
                              <ProductsByQuery query={query} />
                              // @Todo search store also
                        )}

                        {/* Products show by Category */}
                        {category_id && (
                              <ProductsByCategory category_id={category_id}/>
                        )}

                        {/* Products show by Id */}
                        {product_id && (
                              <HeroProduct product_id={product_id}/>
                        )}

                        {/* Products show by Store id */}
                        {store_id && (
                              <StorePublicPage storeId={store_id} />
                        )}

                        {/*Default container*/}
                        {!key && !query && !category_id && !product_id && !store_id && (
                              <DefaultContainer />              
                        )}
                  </div>
            </div>
  )
}

export default UserHomePage
