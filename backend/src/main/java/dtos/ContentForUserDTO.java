package dtos;

import java.util.List;

public record ContentForUserDTO(
    List<VideoOverviewDTO> continueVideos,
    List<VideoOverviewDTO> assignedVideos,
    List<VideoOverviewDTO> suggestedVideos
) { }
