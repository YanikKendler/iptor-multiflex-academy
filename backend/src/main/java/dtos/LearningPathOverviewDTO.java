package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.List;

public record LearningPathOverviewDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        int videoCount,
        ViewProgress viewProgress,
        String color,
        boolean saved
) { }
