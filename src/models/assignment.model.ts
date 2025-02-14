import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
	{
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
	},
	{ timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
