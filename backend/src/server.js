// src/server.js
const app = require("./app");

// You can keep this hardcoded for now; later we may use process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
