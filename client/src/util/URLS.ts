export const urls = {
      adminRegister: 'auth/admin-signup',
      userRegister: 'auth/signup',
      generateOtp: 'auth/generate-otp',
      generateOtpUnique: 'auth/generate-otp/unique',
      verifyOtp: 'auth/verify-otp',
      loginPass: 'auth/login',
      loginOtp: 'auth/login-verify',
      updatePassword: 'auth/update-password',
      forgetPasswordRequest: 'auth/forget-password-request?',
      updatePasswordVaiOtp: 'auth/set-password-otp',


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
      deleteProductById: 'admin/delete-product?productId=',
      updateLogoBanner: 'admin/upload-store-logo-banner',
      getAdminOrders: 'admin/orders',
      shippedOrderById: 'admin/shipped/',
      

      fetchUserDto: 'user/get-user',
      fetchUserDetails: 'user/get-user',
      updateUserDetails: 'user/update-user',
      updateCart: 'user/update-cart',
      fetchCart: 'user/view-cart',
      updateUserName: 'user/update-user-name?name=',
      userUpdateRequest: 'user/request-update?',
      userEmailOrMobileUpdate: 'user/update-user-',
      addNewAddress: 'user/add-new-address',
      updateAddressById: 'user/update-address?id=',
      deleteAddressById: 'user/delete-address?id=',
      setDefaultAddressById: 'user/set-default-address?addressId=',
      getUserCartSummary: 'user/cart-summary',
      userOrdersList: 'user/orders',
      

      fetchHomeProductsBy_: 'home/products',
      fetchHomeStore: 'home/stores',
      fetchHomeStoreById: 'home/store-id?id=',
      fetchHomeStoreDtoByQuery: 'home/stores/query?query=',

      placeOrder: 'order/place',
      deletePendingOrder: 'order/cancel/',
       

}

export const homeProductTypes = {
      category : 'category_id',
      productIds : 'ids',
      keyword: 'keyword',
      storeId: 'store_id',
      searchQuery: 'query'
      
}