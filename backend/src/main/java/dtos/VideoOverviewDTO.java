package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.List;

public record VideoOverviewDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        boolean saved,
        String color,
        Long durationSeconds,
        ViewProgress viewProgress
) { }
