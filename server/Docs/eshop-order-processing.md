
# eShop Order Processing Workflow

This document outlines the steps to process orders in the eShop system, handling both **self-shipping** and **eShop shipping**.

---

## 1. User Adds Items to Cart
- User selects products and adds them to the cart.
- The cart may contain products from multiple stores.

Example:
- **Store 1**: Products `p1`, `p2`, `p3`  
- **Store 2**: Products `px`, `p4`

---

## 2. User Places an Order
- Split the cart into **orders per store**.
- For each store, group products by shipping type:
  - **SELF**: Admin handles shipping manually.
  - **ESHOP**: Use a delivery partner.

Example (Store 1):
- **SELF**: Products `p1`, `p2`
- **ESHOP**: Product `p3`

---

## 3. Process Orders Per Store
For each store’s order:

### Self-Shipping Products
1. Notify admin with:
   - User details (name, address, contact).
   - Product details (IDs, quantity, etc.).
   - Payment type (COD/Prepaid).
2. Admin handles the shipping process and updates the order status.

### eShop Shipping Products
1. **Get Shipping Cost**:
   - Use delivery partner API to calculate the cost based on product weight and dimensions.
2. **Calculate Total Price**:
   - Total = Product price + Tax + Shipping cost.
3. **Payment Processing**:
   - **COD**:
     - Create an order marked as `PENDING`.
     - Notify admin with shipping details.
   - **UPI/Prepaid**:
     - Redirect user to payment gateway.
     - On success, create the order as `PAID` and notify admin.

---

## 4. Add Order to User
- Link the order to the user in the database for tracking.

---

## 5. Update Order Status
The admin or system updates the order status as it progresses. Common states include:
- `PENDING`: Awaiting payment or processing.
- `PAID`: Payment completed successfully.
- `PROCESSING`: Preparing for shipment.
- `SHIPPED`: Dispatched to the user.
- `DELIVERED`: Delivered to the user.
- `CANCELLED`: Order canceled.

API Example:
```http
PUT /api/orders/{orderId}/update
Body:
{
  "status": "SHIPPED"
}
```

---

## Backend Implementation

### Order Splitting Logic
Split the cart into orders grouped by store and shipping type.

### Order Processing Logic
Handle orders for self-shipping and eShop shipping products.

### State Update Logic
Allow updating the state of an order via API or admin interface.

---

## Frontend Flow

### Checkout Page
- Display shipping type for each product.
- Allow the user to select payment options (COD/UPI).

### Admin Dashboard
- Separate views for:
  - Self-shipping orders: Show user details for manual processing.
  - eShop orders: Show delivery partner integration.

---

## Notifications

### To Admin
- **Self-shipping orders**: Notify admin about the order details for manual processing.
- **eShop orders**: Include tracking details and user information.

### To User
- Confirm payment (if prepaid).
- Provide order tracking updates.

---

## Example Workflow

1. **Cart**: User adds `p1`, `p2` (Self) and `p3` (eShop) to the cart.
2. **Order Split**: Create two shipping groups.
3. **Payment**: Process payment (COD or UPI).
4. **Notifications**:
   - Admin notified about self-shipping (`p1`, `p2`).
   - Delivery partner notified about `p3`.
5. **Status Updates**:
   - Update the order state as it progresses.

---

This workflow ensures efficient handling of orders while differentiating between self-shipping and eShop shipping.
