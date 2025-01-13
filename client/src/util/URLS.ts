export const urls = {
      adminRegister: 'auth/admin-signup',
      userRegister: 'auth/signup',
      generateOtp: 'auth/generate-otp',
      verifyOtp: 'auth/verify-otp',
      loginPass: 'auth/login',
      loginOtp: 'auth/login-verify',

      fetchCategories: 'home/get-categories',
      fetchAdminStore: 'admin/get-store',
      createStore: 'admin/create-store',
      updateStore: 'admin/update-store',
      AddProduct: 'admin/add-product',
      fetchStoreProducts: 'admin/my-products',
      updateProductWithId: 'admin/product-update?product-id=',
      uploadProductImage: 'admin/upload-images',
      removeProductImageWithId: 'admin/remove-images?product-id=',
      fetchStoreOrders: 'admin/orders',

      fetchUserDto: 'user/get-user',
      fetchUserDetails: 'user/get-user',
      updateUserDetails: 'user/update-user',
      updateCart: 'user/update-cart',
      fetchCart: 'user/view-cart',


      fetchHomeProductsBy_: 'home/products',
      fetchHomeStore: 'home/stores',
      fetchHomeStoreById: 'home/store-id?id=',
      fetchHomeStoreDtoByQuery: 'home/stores/query?query=',

      
       

}

export const homeProductTypes = {
      category : 'category_id',
      productIds : 'ids',
      keyword: 'keyword',
      storeId: 'store_id',
      searchQuery: 'query'
      
}