import app from "./app.ts";
import { AppDataSource } from "./db.ts";
import "dotenv/config";

const port = process.env.PORT || 5000;

// ✅ Initialize Database & Start Server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL with TypeORM");
    app.listen(port, () => {
      console.log(`🚀 Server running on PORT ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });
