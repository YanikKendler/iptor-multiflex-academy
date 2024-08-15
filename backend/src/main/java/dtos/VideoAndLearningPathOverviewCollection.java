package dtos;

import model.Tag;

import java.util.List;

public record VideoAndLearningPathOverviewCollection(
        List<VideoOverviewDTO> videos,
        List<LearningPathOverviewDTO> learningPaths
) { }
