package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.List;
import java.util.Set;

public record LearningPathOverviewDTO(
        Long contentId,
        String title,
        String description,
        Set<Tag> tags,
        int videoCount,
        ViewProgress viewProgress,
        String color,
        boolean saved
) { }
