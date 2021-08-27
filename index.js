const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
  console.log("Succesfully connected");
})
.catch((err)=>{
  console.log("Failed to connect", err);
})
const sizeSchema = new mongoose.Schema({
  h: Number,
  u:Number,
  uom:String
})
const inventorySchema = new mongoose.Schema({
  item:String,
  qty:Number,
  size:sizeSchema,
  status:String
}, {collection: 'inventory'})
const InvetoryModel = mongoose.model('Inventory', inventorySchema)
async function getItems1(){
  return await InvetoryModel.find({
    status:"A"
  })
  .sort({item:1})
  .select({item:1, qty:1, _id:0})
}
async function getItems2(){
  return await InvetoryModel
  .find()
  .or([{qty: {$lte:30}}, { item: /.*a.*/i }])
  .sort({qty: -1})
}
async function run() {
  const selectedItem = await getItems2();
  console.log(selectedItem);
}
run()