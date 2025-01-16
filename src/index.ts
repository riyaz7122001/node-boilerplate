import "module-alias/register";
import { errorHandler } from "./middleware/error";
import app from "./setup/express";
import { PORT } from "./setup/secrets";
import router from "./routes";

app.use("/api/v1", router);
app.use(errorHandler);

app.listen(PORT || 8080, () => {
  console.log(`Sever started on port ${PORT || 8080}`);
});
