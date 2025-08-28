require('dotenv').config();
const connectDb = require("./mongoConnection");
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const setHeadersAndConnect = async () => {
  return await connectDb();
};

// Create a new task
app.post("/addTask", async (req, res) => {
  try {
    const collection = await setHeadersAndConnect();
    const insertResult = await collection.insertOne(req.body);
    res.status(201).json(insertResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: "⚠️ Could not add the task" });
  }
});

// GET all tasks
app.get("/getTasks", async (req, res) => {
  try {
    const collection = await setHeadersAndConnect();
    const result = await collection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("⚠️ Unable to get tasks");
  }
});

// UPDATE a task
app.put("/updateTask/:id", async (req, res) => {
  try {
    const collection = await setHeadersAndConnect();
    const { task_name, ...otherFields } = req.body;
    const result = await collection.updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: { task_name, ...otherFields } }
    );
    if (result.acknowledged) {
      res.json({ success: "Task updated" });
    }
  } catch (error) {
    res.status(500).json({ error_message: "⚠️ Task could not be updated" });
  }
});

// DELETE a task
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const collection = await setHeadersAndConnect();
    const result = await collection.deleteOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    if (result.acknowledged) {
      res.json({ success: "Task deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: "⚠️ Task could not be deleted" });
  }
});

// CHANGE TASK STATUS
app.put("/changeStatus/:id", async (req, res) => {
  try {
    const collection = await setHeadersAndConnect();
    const { _id, status, isCompleted, ...otherFields } = req.body;

    const result = await collection.updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: { status, isCompleted, ...otherFields } }
    );

    if (result.acknowledged && isCompleted === false) {
      return res.json({ success: "Task marked incomplete" });
    }
    res.json({ success: "Task completed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: "⚠️ Task status could not be updated" });
  }
});

app.listen(PORT, () => console.log(`Server live on ${PORT}`));
