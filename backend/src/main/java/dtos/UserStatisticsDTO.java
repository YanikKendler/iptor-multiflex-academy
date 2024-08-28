package dtos;

import model.User;

public record UserStatisticsDTO(User user, int totalCommentsLeft, int totalVideosRated, double averageStarRatingGiven,
                                int quizzesCompleted, int totalVideosWatched, int totalLearningPathsCompleted,
                                int totalContentSaved, int totalVideosUploaded, int totalLearningPathsUploaded) {
}
