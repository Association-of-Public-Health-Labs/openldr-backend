require("dotenv/config");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const ViralLoadRoutes = require("./app/viralload/routes");
const EIDRoutes = require("./app/eid/routes");
const DictRoutes = require("./app/dictionary/routes");
const AuthRoutes = require("./app/auth/routes");
const Covid19Routes = require("./app/covid19/routes");

class Application {
  app;

  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', process.env.PORT || 4444);
    this.app.set('env', process.env.NODE_ENV || "development");
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({extended: true}));
    // this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extented: true }));

  }
  
  async routes() {
    this.app.use("/api-docs/vl/", swaggerUi.serve, swaggerUi.setup(require("./docs/swagger-vl.json")));
    this.app.use(ViralLoadRoutes);
    this.app.use(EIDRoutes);
    this.app.use(DictRoutes);
    this.app.use(AuthRoutes);
    this.app.use(Covid19Routes);
  }

  start() {
    this.app.listen(this.app.get('port'), () => {
        console.log('>>> Server is running at', this.app.get('port'));
    });
  }
}

module.exports = Application;