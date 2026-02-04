import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import {databaseConnectionKYc } from "./config/db.js";

const PORT = process.env.PORT || 3000;

//Connect to DB first
databaseConnectionKYc();
// import { swaggerDocs } from "./docs/swagger.js";

//swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
