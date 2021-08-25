const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

const routes = require("./controllers");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });

const SequelizeStore = require("connect-session-sequelize")(session.Store);

require("dotenv").config();

const sess = {
  secret: process.env.SESSION_PASSWORD,
  cookie: {
    expires: 15 * 60 * 1000,
  },
  resave: true,
  rolling: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
