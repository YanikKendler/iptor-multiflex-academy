package dtos;

import java.util.List;

public record ContentForUserDTO(
    VideoAndLearningPathOverviewCollection current,
    VideoAndLearningPathOverviewCollection assigned,
    VideoAndLearningPathOverviewCollection suggested
) { }
