import { connect } from "mongoose";
import { DB_CONNECTION_URI } from "./env";

const connectDB = async () => {
	try {
		const connection = await connect(DB_CONNECTION_URI!);
		console.log(`Database connection established: ${connection.connection.host}`);
	} catch (error: any) {
		console.error(`Failed to establish connection with the database: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;
