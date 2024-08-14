package dtos;

import java.util.List;

public record VideoForUserDTO(
    List<VideoOverviewDTO> continueVideos,
    List<VideoOverviewDTO> assignedVideos,
    List<VideoOverviewDTO> suggestedVideos
) { }
