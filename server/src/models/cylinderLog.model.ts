import mongoose from "mongoose";

const cylinderLogSchema = new mongoose.Schema(
	{
		building: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Building",
		},
		date: {
			type: Date,
		},
		cylindersPurchased: {
			type: Number,
		},
		dealer: {
			type: String,
		},
		cost: {
			type: Number,
		},
		otherCost: {
			type: Number,
		},
	},
	{ timestamps: true }
);

const CylinderLog = mongoose.models.CylinderLog || mongoose.model("CylinderLog", cylinderLogSchema);
export default CylinderLog;
