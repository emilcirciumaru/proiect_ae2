const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const sequelize = require('./db');
const Category = require('./models/Category');
const Product = require('./models/Product');

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));


sequelize.authenticate()
    .then(() => console.log("Database connected successfully."))
    .catch(err => console.error("Unable to connect to the database:", err));

    sequelize.sync({ force: false, alter: false })
    .then(() => console.log("Database synced successfully."))
    .catch(err => console.error("Error syncing database:", err));


    app.get("/categories", async (req, res) => {
      try {
          const categories = await Category.findAll();
          res.json(categories);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  });


  app.get("/products/:categoryId", async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.findAll({ where: { categoryId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/product/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (product) {
          res.json(product);
      } else {
          res.status(404).json({ error: "Product not found" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


const stripe = require("stripe")("sk_test_51QYVse2M3AuLjlmEXSyGyVTmTn9WNZpr7MdIi1IqHhqFGZrOMHcAYiYvDDi2yiOYMdlhwmI5iLfCDvdtAie3AWV2006YDvtXUs");


app.post("/checkout", async (req, res, next) => {
    try {
        const session =await stripe.checkout.sessions.create({
        shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
              },
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 0,
                      currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 5,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 7,
                      },
                    },
                  },
                },
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 1500,
                      currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 1,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 1,
                      },
                    },
                  },
                },
              ],
            line_items: req.body.items.map((item) => ({
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: item.name,
                    images: [item.product]
                  },
                  unit_amount: item.price * 100,
                },
                quantity: item.quantity,
              })),
            mode: "payment",
            success_url: "http://localhost:4242/success.html",
            cancel_url: "http://localhost:4242/cancel.html",
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

app.listen(4242, () => console.log('app is running on 4242'));
