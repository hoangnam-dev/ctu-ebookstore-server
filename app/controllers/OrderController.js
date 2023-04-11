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

  var itemList = req.body.itemList;
  var orderNote = req.body.orderNote;
  var customerID = req.body.customerID;
  var orderNote = req.body.orderNote || '';

  try {
    if(itemList.length == 0) {
      return res.json({
        error: false,
        statusCode: order_error_code,
        message: "Hãy chọn sản phẩm cần thanh toán",
      });
    }
    const currency = ratesData.rates[0].value.find(
      (item) => item.code === "USD"
    );
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
        res.redirect(
          `http://localhost:3002/checkout/failed?error=${order_error_code}`
        );
      } else {
        // url_redirect if transaction success
        var url_success_redirect = `http://localhost:3001/api/orders/successPaypal?amount=${amount}&orderID=${order}&customerID=${customerID}`;
        var url_cancel_redirect = `http://localhost:3001/api/orders/cancelPaypal?orderID=${order}`;

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
              description: orderNote,
            },
          ],
        };

        // create a transaction with paypal
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            Order.destroy(order, function (err, order) {
              if (err) {
                res.redirect(
                  `http://localhost:3002/checkout/failed?error=${cancel_error_code}`
                );
              } else {
                res.redirect(
                  `http://localhost:3002/checkout/success?success=${cancel_code}`
                );
              }
            });
            throw error;
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                res.json({ forwardLink: payment.links[i].href });
              }
            }
          }
        });
      }
    });
  } catch (error) {
    res.redirect(
      `http://localhost:3002/checkout/failed?error=${order_failed_code}`
    );
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
    orderID: orderID,
    paymentID: paymentId,
    payerID: payer_id,
  });

  // execute payment request
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        Order.destroy(orderID, function (err, order) {
          if (err) {
            res.redirect(
              `http://localhost:3002/checkout/failed?error=${cancel_error_code}`
            );
          } else {
            res.redirect(
              `http://localhost:3002/checkout/success?success=${cancel_code}`
            );
          }
        });
        throw error;
      } else {
        // change order status to completed and create license ebooks for customerID
        Order.completeOrder(
          orderID,
          orderStatus,
          customerID,
          function (err, status) {
            if (err) {
              res.redirect(
                `http://localhost:3002/checkout/failed?error=${order_error_code}&orderID=${orderID}`
              );
            } else {
              PaypalPayment.store(newTransation, function (err, transaction) {
                if (err) {
                  res.redirect(
                    `http://localhost:3002/checkout/failed?error=${payment_error_code}&orderID=${orderID}`
                  );
                } else {
                  res.redirect(
                    `http://localhost:3002/checkout/success?success=${success_code}`
                  );
                }
              });
            }
          }
        );
      }
    }
  );
};

const cancelPaypal = (req, res) => {
  var orderID = req.query.orderID;
  Order.destroy(orderID, function (err, order) {
    if (err) {
      res.redirect(
        `http://localhost:3002/checkout/failed?error=${cancel_error_code}`
      );
    } else {
      res.redirect(
        `http://localhost:3002/checkout/success?success=${cancel_code}`
      );
    }
  });
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
      var data = orders.map((data) => {
        // return order
        return {
          orderID: data.orderid,
          orderTotalPrice: data.ordertotalprice,
          orderStatus: data.orderstatus,
          orderNote: data.ordernote,
          orderCreatedAt: data.ordercreatedat,
        };
      });
      res.json(data);
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
          detailList: detailList,
          customer: {
            customerID: data.customer.customerid,
            customerName: data.customer.customername,
            customerEmail: data.customer.customeremail,
          },
        };
      });
      res.json(data[0]);
    }
  });
};

const search = function (req, res) {
  var orderID = req.query.orderID;
  Order.search(orderID, function (err, orders) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy đơn hàng",
      });
    } else {
      var data = orders.map((data) => {
        // return order
        return {
          orderID: data.orderid,
          orderTotalPrice: data.ordertotalprice,
          orderStatus: data.orderstatus,
          orderNote: data.ordernote,
          orderCreatedAt: data.ordercreatedat,
        };
      });
      res.json(data);
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
        message: "Cập nhật trạng thái đơn hàng không thành công",
      });
    } else {
      return res.json({
        error: false,
        statusCode: success_code,
        message: "Cập nhật trạng thái đơn hàng thành công",
      });
    }
  });
};

module.exports = {
  allOrder,
  getOrderByID,
  order,
  search,
  successPaypal,
  cancelPaypal,
  update,
};
