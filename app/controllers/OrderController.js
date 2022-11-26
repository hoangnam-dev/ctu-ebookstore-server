const Order = require("../models/Order");
const PaypalPayment = require("../models/PaypalPayment");
const paypal = require("paypal-rest-sdk");
const ratesData = require("../../utils/rates.json");

const order_error_code = "order_error";
const success_code = "success";
const payment_error_code = "payment_error";
const cancel_code = "cancel";
const cancel_error_code = "cancel_error";

const order = async (req, res) => {
  var amount = 0;

  var itemList = req.body.itemList;
  var orderNote = req.body.orderNote;
  var customerID = req.body.customerID;
  var orderNote = req.body.orderNote;

  // if customer borrow ebook
  // var expiresBorrow = req.body.expiresBorrow;
  // var borrowEbook = req.body.borrowEbook;
  
  // Test with browser
  // var borrowEbook = true;
  // var expiresBorrow = 2;
  
  
  // var orderNote = "test order";
  // var customerID = 4;
  // var itemList = [
  //   {
  //     ebookID: 1,
  //     ebookName: "ebook1",
  //     ebookPrice: 24000,
  //   },
  //   {
  //     ebookID: 2,
  //     ebookName: "ebook2",
  //     ebookPrice: 24000,
  //   },
  // ];

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

  // Order total price
  for (let i = 0; i < paypalItem.length; i++) {
    amount += parseFloat(paypalItem[i].price);
  }

  // Create order info
  const newOrder = new Order({
    orderTotalPrice: amount,
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

const paymentPaypal = (req, res) => {
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3001/api/orders/success",
      cancel_url: "http://localhost:3001/api/orders/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item 1",
              sku: "1",
              price: "1.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "1.00",
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

const paymentVNPay = (
  amount,
  bankCode,
  orderDescription,
  orderType,
  language
) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var config = require("config");
  var dateFormat = require("dateformat");

  var tmnCode = config.get("vnp_TmnCode");
  var secretKey = config.get("vnp_HashSecret");
  var vnpUrl = config.get("vnp_Url");
  var returnUrl = config.get("vnp_ReturnUrl");

  var date = new Date();

  var createDate = dateFormat(date, "yyyymmddHHmmss");
  var orderId = dateFormat(date, "HHmmss");
  var amount = amount;
  var bankCode = bankCode;

  var orderInfo = orderDescription;
  var orderType = orderType;
  var locale = language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl);
};

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
      res.json(orders);
    }
  });
};

// Store new order
const store = function (req, res) {
  var newOrder = new Order(req.body);
  if (!newOrder.ordertotalprice) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tạo đơn hàng không được để trống",
    });
  } else {
    Order.store(newOrder, itemList, function (err, order) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm đơn hàng không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm đơn hàng thành công",
        });
      }
    });
  }
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
      res.json(order);
    }
  });
};

// Store new order
const update = function (req, res) {
  var newOrder = new Order(req.body);
  var orderID = req.params.id;
  if (!newOrder.ordername) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên đơn hàng không được để trống",
    });
  } else {
    Order.update(orderID, newOrder, function (err, order) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật đơn hàng không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật đơn hàng thành công",
        });
      }
    });
  }
};

const check = (req, res) => {
  var orderID = 6;
  var orderStatus = 1;
  var customerID = 1;
  // var expiresBorrow = req.query.expiresBorrow;
  var expiresBorrow = undefined;
  var orderStatus = 1;
  console.log(expiresBorrow);
  Order.complete(orderID, orderStatus, customerID, expiresBorrow, function (err, status) {
    if (err) {
      return res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi không thể cập nhật trạng thái đơn hàng",
      });    
    }
  })
}

module.exports = {
  allOrder,
  getOrderByID,
  order,
  store,
  update,
  paymentPaypal,
  successPaypal,
  cancelPaypal,
  check,
  // destroy,
};
