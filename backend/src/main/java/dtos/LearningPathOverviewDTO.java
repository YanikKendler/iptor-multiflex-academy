package dtos;

import model.Tag;

import java.util.List;

public record LearningPathOverviewDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        int videoCount,
        int viewProgress
) { }
