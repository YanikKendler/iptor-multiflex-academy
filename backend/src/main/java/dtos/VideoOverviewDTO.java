package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.List;
import java.util.Set;

public record VideoOverviewDTO(
        Long contentId,
        String title,
        String description,
        Set<Tag> tags,
        boolean saved,
        String color,
        Long durationSeconds,
        int questionCount,
        ViewProgress viewProgress
) { }
