import mongoose from "mongoose";

const gasUsageSchema = new mongoose.Schema(
	{
		flat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flat",
		},
		month: {
			type: Number,
		},
		year: {
			type: Number,
		},
		unitUsed: {
			type: Number,
		},
		unitCost: {
			type: Number,
		},
		totalCost: {
			type: Number,
		},
	},
	{ timestamps: true }
);

gasUsageSchema.index({ flat: 1, month: 1, year: 1 }, { unique: true });

const GasUsage = mongoose.models.GasUsage || mongoose.model("GasUsage", gasUsageSchema);
export default GasUsage;
