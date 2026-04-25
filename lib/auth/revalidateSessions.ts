import User from "../models/User";
import { connectToDB } from "../db/connect";
import { getAuth } from ".";

/**
 * Revalidate sessions for specific roles when role is updated
 * - admin, manager, order-manager
 *
 */
export async function revalidateSessions() {
  await connectToDB();

  // Get all users with roles: admin, manager, order-manager
  const users = await User.find({
    role: { $in: ["admin", "manager", "order-manager"] },
  }).select("_id role");

  for (const user of users) {
    try {
      // invalidate session
      const auth = await getAuth();
      auth.api.revokeSessions(user._id.toString());
      console.log(`Session invalidated for user ${user._id} (${user.role})`);
    } catch (err) {
      console.error("Failed to invalidate session for user:", user._id, err);
    }
  }
}
