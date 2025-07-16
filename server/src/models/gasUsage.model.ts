import mongoose from "mongoose";

const gasUsageSchema = new mongoose.Schema(
	{
		flat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flat",
		},
		date: {
			type: Date,
		},
		unitCost: {
			type: Number,
		},
		unitUsed: {
			type: Number,
		},
		totalCost: {
			type: Number,
		},
	},
	{ timestamps: true }
);
const GasUsage = mongoose.models.GasUsage || mongoose.model("GasUsage", gasUsageSchema);
export default GasUsage;
