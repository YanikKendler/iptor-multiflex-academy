package dtos;

public record LearningPathEntryDTO(
        Long pathEntryId,
        Long videoId,
        String videoTitle,
        int entryPosition
) {
}
