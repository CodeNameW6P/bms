import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
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
		amount: {
			type: Number,
		},
	},
	{ timestamps: true }
);

contributionSchema.index({ flat: 1, month: 1, year: 1 }, { unique: true });

const Contribution =
	mongoose.models.Contribution || mongoose.model("Contribution", contributionSchema);
export default Contribution;
