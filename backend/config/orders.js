import connectDb from "./db.js";
const q1="Select * from restaurentMenu"

let rData=await connectDb(q1);
 
const q2="Select * from meatShopMenu"
let mData=await connectDb(q2);


export {
    mData,
    rData
}



