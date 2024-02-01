const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017";
const DB_NAME = "usermanagement";
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", "./views");

let db;

MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("userdata");

    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function getUserById(userId) {
  try {
    const collection = db.collection("users"); // Assuming your collection is named 'users'
    //console.log(collection);
    const user = await collection.findOne({ _id: userId }); // Assuming _id is the identifier field
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null; // Handle error appropriately in your application
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.render("index", { users });
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/newuser", (req, res) => {
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.render("new_user", { users });
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/deleteuser", (req, res) => {
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.render("delete", { users });
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/edituser/:userId", async (req, res) => {
  const userId = req.params.userId;
  // Fetch user data based on userId from your data source (e.g., database)
  const user = await getUserById(new ObjectId(userId)); // Implement this function to retrieve user data
  console.log(userId);
  console.log(user);
  res.render("edit", { user: user });
});

// Connect to MongoDB

// Handle routes and CRUD operations below
// ... (previous code)

// Handle routes and CRUD operations below

// Get all users
app.get("/users", (req, res) => {
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.render("index", { users });
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/users/:id", (req, res) => {
  console.log("hello");
  const userId = req.params.id;
  const updatedUser = req.body;
  console.log(updatedUser);
  db.collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser })
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      db.collection("users")
        .find()
        .toArray()
        .then((users) => {
          res.render("index", { users });
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.error("Error updating user by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//Get a user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.collection("users")
    .findOne({ _id: new ObjectId(userId) })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      db.collection("users")
        .find()
        .toArray()
        .then((users) => {
          res.render("index", { users });
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.error("Error fetching user by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  db.collection("users")
    .insertOne(newUser)
    .then((result) => {
      res.redirect("/users");
    })
    .catch((err) => {
      console.error("Error creating a new user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Update a user by ID

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.collection("users")
    .deleteOne({ _id: new ObjectId(userId) })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      db.collection("users")
        .find()
        .toArray()
        .then((users) => {
          res.render("index", { users });
        });
    })
    .catch((err) => {
      console.error("Error deleting user by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


