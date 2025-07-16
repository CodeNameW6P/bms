import mongoose from "mongoose";

const cylinderSchema = new mongoose.Schema(
	{
		building: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Building",
		},
		date: {
			type: Date,
		},
		amount: {
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

const Cylinder = mongoose.models.Cylinder || mongoose.model("Cylinder", cylinderSchema);
export default Cylinder;
