import mongoose from "mongoose"
import {Subscription} from "../models/subscription.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    console.log("toggleSubscription called with channelId:", channelId, "user:", req.user?._id);

    if (!mongoose.isValidObjectId(channelId)) {
        console.log("Invalid channelId detected!");
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if the user is trying to subscribe to themselves
    if (channelId.toString() === req.user?._id.toString()) {
        console.log("User trying to subscribe to themselves!");
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id
    });

    if (subscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(subscription._id);
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
    } else {
        // Subscribe
        await Subscription.create({
            channel: channelId,
            subscriber: req.user?._id
        });
        return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    
    // Default to the logged-in user if no subscriberId is provided or if it's "me"
    const targetUserId = (subscriberId && subscriberId !== "me") ? subscriberId : req.user?._id;

    if (!mongoose.isValidObjectId(targetUserId)) throw new ApiError(400, "Invalid subscriber ID");

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(targetUserId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel: { $first: "$channel" }
            }
        },
        {
            // Now let's fetch the latest videos for these channels!
            $lookup: {
                from: "videos",
                localField: "channel._id",
                foreignField: "owner",
                as: "latestVideos",
                pipeline: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 3 }
                ]
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
