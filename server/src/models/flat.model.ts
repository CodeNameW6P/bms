import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
	{
		flatNumber: {
			type: String,
			required: true,
			unique: true,
		},
		building: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Building",
			required: true,
		},
		owner: {
			type: String,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		status: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

const Flat = mongoose.models.Flat || mongoose.model("Flat", flatSchema);
export default Flat;
