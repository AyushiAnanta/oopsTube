import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const like = await Like.findOne({ video: videoId, likedBy: req.user?._id });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked successfully"));
    } else {
        await Like.create({ video: videoId, likedBy: req.user?._id });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

    const like = await Like.findOne({ comment: commentId, likedBy: req.user?._id });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked successfully"));
    } else {
        await Like.create({ comment: commentId, likedBy: req.user?._id });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked successfully"));
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const like = await Like.findOne({ tweet: tweetId, likedBy: req.user?._id });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked successfully"));
    } else {
        await Like.create({ tweet: tweetId, likedBy: req.user?._id });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                { $project: { fullname: 1, username: 1, avatar: 1 } }
                            ]
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } }
                ]
            }
        },
        {
            $addFields: {
                video: { $first: "$video" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    // Extract just the videos from the likes array
    const videos = likedVideos.map(like => like.video).filter(v => v);

    return res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
