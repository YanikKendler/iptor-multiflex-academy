package dtos;

public record LearningPathEntryDTO(
        Long pathEntryId,
        Long videoId,
        String videoTitle,
        Long durationSeconds,
        int questionCount,
        int entryPosition
) {
}
