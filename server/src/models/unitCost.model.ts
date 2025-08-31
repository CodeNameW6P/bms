import mongoose from "mongoose";

const unitCostSchema = new mongoose.Schema(
	{
		month: {
			type: Number,
		},
		year: {
			type: Number,
		},
		unitCost: {
			type: Number,
		},
	},
	{ timestamps: true }
);

unitCostSchema.index({ month: 1, year: 1 }, { unique: true });

const UnitCost = mongoose.models.UnitCost || mongoose.model("UnitCost", unitCostSchema);
export default UnitCost;
