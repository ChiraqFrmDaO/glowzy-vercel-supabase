import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Serve de public folder (favicon, OG-image, andere assets)
app.use(express.static(path.join("/home/ubuntu/fresh-linkr/public")));

// Route voor OG-image
app.get("/api/profiles/og-image", (req, res) => {
  res.sendFile(path.join("/home/ubuntu/fresh-linkr/public/og-image.png"));
});

// Basis route (kan later je front-end index.html serveren)
app.get("/", (req, res) => {
  res.sendFile(path.join("/home/ubuntu/fresh-linkr/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
