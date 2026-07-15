# ecommerce-node

### Future considerations

- Add login/logout session on different devices.(Consider using multiple refresh tokens)
- Review logout for both couuckis and authorization headers
- Handle unknown fields on data entry
- Re-think delete for products, as they are atteched to orders and carts which are preffered kept for user history( You can make delete deactivate the product from being returned but kept in the db)

## OrderStatus implementation

| Order Status   | Customer can cancel?     | Reason                                                                             |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **PENDING**    | ✅ Yes                    | The shop hasn't reviewed the order yet.                                            |
| **ACCEPTED**   | ✅ Usually yes (optional) | If the shop hasn't started preparing it. Some businesses allow this, others don't. |
| **PROCESSING** | ❌ No                     | The shop is already preparing the order and may have incurred costs.               |
| **COMPLETED**  | ❌ No                     | The order is finished. Returns/refunds are a separate process.                     |
| **REJECTED**   | ❌ No                     | The shop already declined the order.                                               |
| **CANCELLED**  | ❌ No                     | Already cancelled.                                                                 |
