const Order = require("../models/Order");
const PaypalPayment = require("../models/PaypalPayment");
const paypal = require("paypal-rest-sdk");
const ratesData = require("../../utils/rates.json");

const order_error_code = "order_error";
const order_failed_code = "order_failed";
const success_code = "success";
const payment_error_code = "payment_error";
const cancel_code = "cancel";
const cancel_error_code = "cancel_error";

const order = async (req, res) => {
  var amount = 0;
  var totalPrice = 0;

  // var itemList = req.body.itemList;
  // var orderNote = req.body.orderNote;
  // var customerID = req.body.customerID;
  // var orderNote = req.body.orderNote;

  // if customer borrow ebook
  // var expiresBorrow = req.body.expiresBorrow;
  // var borrowEbook = req.body.borrowEbook;
  
  // Test with browser
  // var borrowEbook = true;
  // var expiresBorrow = 2;
  
  
  var orderNote = "test order";
  var customerID = 2;
  var itemList = [
    {
      ebookID: 1,
      ebookName: "ebook1",
      ebookPrice: 24000,
    },
    {
      ebookID: 2,
      ebookName: "ebook2",
      ebookPrice: 24000,
    },
  ];
  try {
    const currency = ratesData.rates[0].value.find((item) => item.code === "USD");
    const sell = parseFloat(currency.sell.replace(",", ""));
    var paypalItem = itemList.map((item) => {
      var output = parseFloat(item.ebookPrice) / sell;
      // /convert VND to USD
      var price = Math.round(output * 1000) / 1000;
      return {
        name: item.ebookName,
        sku: item.ebookID,
        price: price.toFixed(2),
        currency: "USD",
        quantity: 1,
      };
    });

    // Paypal amount
    for (let i = 0; i < paypalItem.length; i++) {
      amount += parseFloat(paypalItem[i].price);
    }
    
    // Order total price
    for (let i = 0; i < itemList.length; i++) {
      totalPrice += parseFloat(itemList[i].ebookPrice);
    }

    // Create order info
    const newOrder = new Order({
      orderTotalPrice: totalPrice,
      orderStatus: 0,
      orderNote: orderNote,
      customerID: customerID,
    });

    // Store order
    Order.store(newOrder, itemList, function (err, order) {
      if (err) {
        return res.json({
          error: true,
          statusCode: order_error_code,
          message: "Lỗi! Thêm đơn hàng không thành công",
        });
      } else {
        // url_redirect if transaction success
        var url_success_redirect = `http://localhost:3001/api/orders/successPaypal?amount=${amount}&orderID=${order}&customerID=${customerID}`;
        var url_cancel_redirect = `http://localhost:3001/api/orders/cancelPaypal?orderID=${order}`;
        // if(borrowEbook !== undefined) {
        //   url_redirect = `http://localhost:3001/api/orders/success?amount=${amount}&orderID=${order}&customerID=${customerID}&expiresBorrow=${expiresBorrow}`; 
        // }

        // create payment info json
        var create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: url_success_redirect,
            cancel_url: url_cancel_redirect,
          },
          transactions: [
            {
              item_list: {
                items: paypalItem,
              },
              amount: {
                currency: "USD",
                total: amount.toString(),
              },
              description: "This is the payment description.",
            },
          ],
        };

        // create a transaction with paypal
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            Order.destroy(order, function (err, order) {
              if (err) {
                return res.json({
                  error: false,
                  statusCode: cancel_error_code,
                  message: "Đã hủy đặt hàng không thành công",
                }); 
              } else {
                return res.json({
                  error: false, 
                  statusCode: cancel_code,
                  message: "Đã hủy đặt hàng",
                }); 
              }
            })
            throw error;
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                // redirect to approval
                res.redirect(payment.links[i].href);
              }
            }
          }
        });

        // var saleQuantityMax;
        // var saleQuantityCurrent;

        // // Option 1: don't have promotion
        // if (ebookSaleType === null && ebookSaleCode === null) {
        //   // Payment and store order
        // }

        // // Option 2: sale in ebook price
        // if (ebookSaleType !== null) {
        //   if (ebookSaleType == "1") {
        //     ebookPrice = ebookPrice - (ebookPrice * ebookSaleValue) / 100;
        //   } else {
        //     ebookPrice = ebookPrice - ebookSaleValue;
        //   }
        // }

        // // Option 3: check have sale code
        // if (ebookSaleCode !== null) {
        //   Ebook.getPriceCurrent(ebookID, ebookSaleCode, function (err, data) {
        //     if (err) {
        //       return res.json({
        //         error: true,
        //         statusCode: 0,
        //         message: "Lỗi không thể lấy thông tin ebook",
        //       });
        //     } else {
        //       var saleQuantityCurrent = data.salequantitycurrent;
        //       var saleQuantityMax = data.salequantitymax;
        //       var saleType = data.saleType;
        //       var saleValue = data.saleValue;

        //       // Check sale code available quantity use
        //       if (saleQuantityCurrent > saleQuantityMax) {
        //         return res.json({
        //           error: true,
        //           statusCode: 0,
        //           message: "Mã giám đã hết lượt sử dụng",
        //         });
        //       }

        //       if (saleType == "1") {
        //         amount = amount - (amount * saleValue) / 100;
        //       } else {
        //         amount = amount - saleValue;
        //       }

        //       // increment quantity current
        //       saleQuantityCurrent = saleQuantityCurrent + 1;

        //       console.log("have sale code");
        //       console.log(amount);
        //     }
        //   });
        // } else {
        //   console.log("don't have sale code");
        //   console.log(ebookPrice);
        // }
      }
    });
  } catch (error) {
    return res.json({
      error: false,
      statusCode: order_failed_code,
      message: "Lỗi! Đặt hàng không thành công",
    }); 
  }
};

const successPaypal = (req, res) => {
  var amountReq = req.query.amount;
  var orderID = req.query.orderID;
  var customerID = req.query.customerID;
  var orderStatus = 1;
  var payer_id = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
    payer_id: payer_id,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: amountReq,
        },
      },
    ],
  };
  var newTransation = new PaypalPayment({
    orderID : orderID,
    paymentID : paymentId,
    payerID : payer_id,
  });

  // execute payment request
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      
      if (error) {
        Order.destroy(orderID, function (err, order) {
          if (err) {
            return res.json({
              error: false,
              statusCode: cancel_error_code,
              message: "Đã hủy đặt hàng không thành công",
            }); 
          } else {
            return res.json({
              error: false, 
              statusCode: cancel_code,
              message: "Đã hủy đặt hàng",
            }); 
          }
        })
        throw error;

      } else {
        // change order status to completed and create license ebooks for customerID
        Order.completeOrder(orderID, orderStatus, customerID, function (err, status) {
          if (err) {
            return res.json({
              error: false,
              statusCode: order_error_code,
              message: `Đã thanh toán. Lỗi không cập nhật trạng thái đơn hàng ${orderID}. Liên hệ nhân viên hỗ trợ`,
            });   
          } else {
            PaypalPayment.store(newTransation, function (err, transaction) {
              if (err) {
                return res.json({
                  error: true,
                  statusCode: payment_error_code,
                  message: `Đặt hàng thành công. Lỗi không thể lưu thông tin giao dịch Paypal đơn hàng ${orderID}. Liên hệ nhân viên hỗ trợ`,
                }); 
              } else {
                res.json({
                  error: false,
                  statusCode: success_code,
                  message: "Đặt hàng thành công",
                });
              }
            })
          }
        })
      }
    }
  );
};

const cancelPaypal = (req, res) => {
  var orderID = req.query.orderID;
  Order.destroy(orderID, function (err, order) {
    if (err) {
      return res.json({
        error: false,
        statusCode: cancel_error_code,
        message: "Đã hủy đặt hàng không thành công",
      }); 
    } else {
      return res.json({
        error: false, 
        statusCode: cancel_code,
        message: "Đã hủy đặt hàng",
      }); 
    }
  })
}

// Show all order
const allOrder = function (req, res) {
  Order.getAll(function (err, orders) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var data = order.map((data) => {
        // return order
        return {
          orderID: data.orderid,
          orderTotalPrice: data.ordertotalprice,
          orderStatus: data.orderstatus,
          orderNote: data.ordernote,
          orderCreatedAt: data.ordercreatedat,
          detailList: detailList
        };
      });
      res.json(data[0]);
    }
  });
};

// Get order by ID
const getOrderByID = function (req, res) {
  var orderID = req.params.id;
  Order.getOrderByID(orderID, function (err, order) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy đơn hàng",
      });
    } else {
      var data = order.map((data) => {
        var detailList = data.detailList.map((detail) => {
          return {
            ebookID: detail.ebookid,
            ebookName: detail.ebookname,
            orderPrice: detail.detailorderprice,
            orderQuantity: detail.detailorderquantity,
          };
        });

        // return order
        return {
          orderID: data.orderid,
          orderTotalPrice: data.ordertotalprice,
          orderStatus: data.orderstatus,
          orderNote: data.ordernote,
          orderCreatedAt: data.ordercreatedat,
          detailList: detailList
        };
      });
      res.json(data[0]);
    }
  });
};

// Update order status
const update = (req, res) => {
  var orderID = req.params.id;
  var orderStatus = req.body.orderStatus;

  Order.updateStatus(orderID, orderStatus, (err, result) => {
    if (err) {
      return res.json({
        error: true,
        statusCode: order_error_code,
        message: "Cập nhật trạng thái đơn hàng không thành công"
      });
    } else {
      return res.json({
        error: false,
        statusCode: success_code,
        message: "Cập nhật trạng thái đơn hàng thành công"
      });
    }
  });
}

module.exports = {
  allOrder,
  getOrderByID,
  order,
  successPaypal,
  cancelPaypal,
  update,
};
