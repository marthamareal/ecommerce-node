# ecommerce-node

### Future considerations

- Add login/logout session on different devices.(Consider using multiple refresh tokens)
- Review logout for both couuckis and authorization headers
- Handle unknown fields on data entry
- Re-think delete for products, as they are atteched to orders and carts which are preffered kept for user history( You can make delete deactivate the product from being returned but kept in the db)
