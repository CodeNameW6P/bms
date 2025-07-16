import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
	{
		month: {
			type: Date,
		},
		flat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flat",
		},
		billTotal: {
			type: Number,
		},
		billPaid: {
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
