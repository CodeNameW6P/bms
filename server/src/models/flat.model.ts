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
		ownerName: {
			type: String,
		},
		ownerPhone: {
			type: String,
		},
		ownerEmail: {
			type: String,
		},
		renterName: {
			type: String,
		},
		renterPhone: {
			type: String,
		},
		renterEmail: {
			type: String,
		},
		isOccupied: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

const Flat = mongoose.models.Flat || mongoose.model("Flat", flatSchema);
export default Flat;
