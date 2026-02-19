const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.addFeedback = async (req, res) => {
    try {
        const { toUserId, rating, comment, sessionId } = req.body;
        const fromUserId = req.user.id;

        console.log(`[FEEDBACK] Submission received from ${fromUserId} for ${toUserId}. Rating: ${rating}`);

        if (fromUserId === toUserId) {
            console.warn(`[FEEDBACK_VALIDATION] User ${fromUserId} attempted to give feedback to themselves.`);
            return res.status(400).json({ message: 'You cannot give feedback to yourself' });
        }

        const feedback = new Feedback({
            fromUser: fromUserId,
            toUser: toUserId,
            rating,
            comment,
            sessionId
        });

        await feedback.save();

        // Update User's average rating
        const feedbacks = await Feedback.find({ toUser: toUserId });
        if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
            const avgRating = totalRating / feedbacks.length;

            await User.findByIdAndUpdate(toUserId, {
                rating: avgRating,
                totalRatings: feedbacks.length
            });
            console.log(`[FEEDBACK] User ${toUserId} rating updated to ${avgRating.toFixed(2)} (${feedbacks.length} ratings)`);
        }

        res.status(201).json({ message: 'Feedback added' });
    } catch (err) {
        console.error("[FEEDBACK_ERROR]", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
