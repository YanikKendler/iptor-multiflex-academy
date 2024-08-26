package dtos;

public record UserAssignedContentDTO(
        Long contentId,
        String title,
        String type,
        double progress,
        int questionOrVideoCount,
        String color
) { }
