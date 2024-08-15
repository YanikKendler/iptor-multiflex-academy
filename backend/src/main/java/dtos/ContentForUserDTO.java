package dtos;

import java.util.List;

public record ContentForUserDTO(
    List<VideoAndLearningPathOverviewCollection> current,
    List<VideoAndLearningPathOverviewCollection> assigned,
    List<VideoAndLearningPathOverviewCollection> suggested
) { }
