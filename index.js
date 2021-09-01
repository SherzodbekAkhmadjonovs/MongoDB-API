const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Succesfully connected");
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });
const sizeSchema = new mongoose.Schema({
  h: Number,
  u: Number,
  uom: String,
});
const inventorySchema = new mongoose.Schema(
  {
    item: String,
    qty: Number,
    size: sizeSchema,
    status: String,
  },
  { collection: "inventory" }
);
const InvetoryModel = mongoose.model("Inventory", inventorySchema);
async function getItems1() {
  return await InvetoryModel.find({
    status: "A",
  })
    .sort({ item: 1 })
    .select({ item: 1, qty: 1, _id: 0 });
}
async function getItems2() {
  return await InvetoryModel.find()
    .or([{ qty: { $lte: 30 } }, { item: /.*a.*/i }])
    .sort({ qty: -1 });
}
async function run() {
  const selectedItem = await getItems2();
  console.log(selectedItem);
}

// 1th way to update item by only id

async function updateItem1(id) {
  const items = await InvetoryModel.findById(id);
  if (!items) return;

  items.item = "Desktop PC";

  const updatedItem = await items.save();
  console.log(updatedItem);
}
// 2nd way for updating by item filters
async function updateItem2(id) {
  const updatedItem = await InvetoryModel.updateOne(
    { _id: id },
    {
      $set: {
        item: "IMask",
      },
    }
  );
  console.log(updatedItem);
}
updateItem2("612920fefe2dc0b87af5cfc3");
