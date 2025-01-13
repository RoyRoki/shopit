1. User adds items to the cart
   |
   v
2. User proceeds to checkout
   |
   v
3. System generates Cart Summary:
   - List of products
   - Shipping type per store
   - Payment options (COD or online)
   |
   v
4. User selects shipping and payment method
   |
   v
5. System validates the cart:
   - Availability of products
   - Shipping cost and GST calculation
   |
   v
6. Order is created:
   - Order entity created (with user info)
   - OrderItems are created for each product in the cart
   |
   v
7. System generates OrderPerStore entities:
   - Each store in the cart gets its own order summary (subtotal, delivery cost, GST, total)
   |
   v
8. Order status is set to "PENDING"
   |
   v
9. System processes payment (if online payment) or prepares for delivery (COD)
   |
   v
10. User receives confirmation of the order
