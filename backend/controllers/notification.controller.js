import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        });
        await Notification.updateMany({ to: userId},{read: true});
        console.log("notification is seen by the user");
        res.status(200).json(notifications)
    } catch (error) {
        console.log("Error in getNotifications function: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        console.log("All notifications are deleted");
        res.status(200).json({ message: "All notifications are deleted" });
    } catch (error) {
        console.log("Error in deleteNotifications function: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
