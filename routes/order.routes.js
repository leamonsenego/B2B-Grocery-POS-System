
const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middleware/route-guard.js');

const generateOrderPageNumber = (itemLength) => {
  
    let pages = (itemLength / 5);
    let pageString = pages.toString().split(".");
    
    if (pageString.length == 2) {
      const pageCount = parseInt(pageString[0]) + 1;
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }else {
       return Array.from({ length: pages }, (_, i) => i + 1);
    }
  };

/* GET home page */
router.get("/order-history", isLoggedIn, (req, res, next) => {
    Order.find()
    .then((orderList) => {
  console.log(orderList)
      res.render('order-history', { orderList });
    })
    .catch((err) => next(err));

});

// API routefor all order
router.get("/api/orders", isLoggedIn, (req, res, next) => {
    Order.find()
      .then((orderList) => {
        res.json(orderList);
      })
      .catch((err) => next(err));
     });

router.get("/order-history/goto/:pageNumber", (req, res, next) => {
    const { pageNumber } = req.params;
    const skip = (parseInt(pageNumber) - 1) * 5;
    
    Order.find().count()
    .then((orderCount) => {
            Order.find()
                .skip(skip)
                .limit(5)
                .then((orderList) => {
                    res.render('order-history', { orderList, orderPagination: generateOrderPageNumber(orderList.length) });
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

// New route to handle order details
router.get("/order-history/:orderId", isLoggedIn, (req, res, next) => {
    const orderId = req.params.orderId;

    // Find the order by ID
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                // If order not found, you might want to handle this case (e.g., render an error page)
                return res.status(404).send('Order not found');
            }
              // Send the order details as JSON
        res.json(order);
        console.log(order)
        })
      
        .catch((err) => next(err));
});

router.post("/orderCreate", isLoggedIn, (req, res, next) => {
     const { Products, total, customerFirstName, customerLastName, customerPhoneNumber ,customerId,orderNumber} = req.body;
     
    Order.create({
        Products: Products.map((product, index) => ({
            product:product.productId, // Assuming productId is sent in the request
            productName: product.productName,
            quantity: product.quantity,
          })),
         total,
         customerFirstName,
         customerLastName,
         customerPhoneNumber,
         customerId,
         orderNumber,
         orderDate: new Date(), 

        })
        .then(() => {
            res.status(200);
            res.send({msg: 'order added successfully'})
         
        })
        .catch(err => next(err));

    })
// POST request to delete a product
router.post("/order-history/:id/delete", (req, res, next) => {
    const { id } = req.params;
  
    Order.findByIdAndRemove(id)
      .then(() => {
        res.redirect("/order-history");
      })
      .catch((err) => {
        next(err);
      });
  });
    
module.exports = router;