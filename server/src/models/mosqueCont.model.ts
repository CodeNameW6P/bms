import mongoose from "mongoose";

const mosqueContSchema = new mongoose.Schema(
	{
		flat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flat",
		},
		date: {
			type: Date,
		},
		amount: {
			type: Number,
		},
	},
	{ timestamps: true }
);

const MosqueCont = mongoose.models.MosqueCont || mongoose.model("MosqueCont", mosqueContSchema);
export default MosqueCont;
