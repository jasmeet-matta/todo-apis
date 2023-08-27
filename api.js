const connectDb = require("./mongoConnection");
const express = require("express");
const cors = require("cors");
const app = express();
//to create a new object for deleting record using id
const mongodb = require("mongodb");
const PORT = process.env.PORT;
const mongoose = require("mongoose");

app.use(cors());
//middleware to parse data
app.use(express.json());

const setHeadersAndConnect = async (res) => {
  return await connectDb();
};

// MongoDB connection
mongoose.connect(
  "mongodb+srv://jasmeetmatta:SKw0OTT8t2c6jlor@cluster0.vfums6e.mongodb.net/myDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Task model
const Task = mongoose.model(
  "Task",
  {
    task_name: String,
    isCompleted: Boolean,
    taskType: Number,
    taskCreatedDate: String,
    taskDueDate: String,
  },
  "todo"
);

// Create a new task
app.post("/addTask", async (req, res) => {
  try {
    const taskData = req.body;
    const task = new Task(taskData);
    await task.save();
    res.json(task);
    console.log(task);
  } catch (error) {
    res.status(500).json({ error_message: "⚠️ Could not add the task" });
  }
});

//GET endpoint
app.get("/getTasks", async (req, res) => {
  try {
    const data = await setHeadersAndConnect(res);
    const result = await data.find().toArray();
    // const deleteWhere = await data.deleteMany({ foodItem: "food" });
    res.send(result);
    // console.log(req);
  } catch (error) {
    console.error(error);
    res.status(500).send("⚠️ Unable to get tasks");
  }
});

app.put("/updateTask/:id", async (req, res) => {
  try {
    const data = await setHeadersAndConnect(res);
    const { task_name, ...otherFields } = req.body;

    const result = await data.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { task_name, ...otherFields } }
    );
    if (result.acknowledged) {
      res.send({ success: "Task updated" });
    }
    console.log(result);
  } catch (error) {
    res.status(500).send({ error_message: "⚠️ Task could not be updated" });
  }
});

//DELETE endpoint
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const data = await setHeadersAndConnect(res);
    const result = await data.deleteOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    if (result.acknowledged) {
      res.send({ success: "Task deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error_message: "⚠️ Task could not be deleted" });
  }
});

//CHANGE TASK STATUS endpoint
app.put("/changeStatus/:id/", async (req, res) => {
  try {
    const data = await setHeadersAndConnect(res);
    const { _id, status, ...otherFields } = req.body;
    let flag = req.body.isCompleted;

    // isCompleted = !req.params.status;
    const result = await data.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { status, ...otherFields } }
    );
    if (result.acknowledged && flag == false) {
      res.send({ success: "Task marked incomplete" });
    } else {
      res.send({ success: "Task completed successfully!" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error_message: "⚠️ Task status could not be updated" });
  }
});

app.listen(PORT, () => console.log(`live on ${PORT}`));
