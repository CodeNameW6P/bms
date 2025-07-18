import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
		},
		flat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flat",
		},
		totalAmount: {
			type: Number,
		},
		paidAmount: {
			type: Number,
		},
		status: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);
export default Bill;
