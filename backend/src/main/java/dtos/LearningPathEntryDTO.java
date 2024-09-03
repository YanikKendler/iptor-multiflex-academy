package dtos;

import java.time.LocalDateTime;

public record LearningPathEntryDTO(
        Long pathEntryId,
        Long videoId,
        String videoTitle,
        Long durationSeconds,
        int questionCount,
        int entryPosition,
        LocalDateTime startTime,
        LocalDateTime endTime,
        double progress
) {
}
