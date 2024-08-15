package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.List;

public record VideoOverviewDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        String color,
        Long durationSeconds,
        ViewProgress viewProgress
) { }
