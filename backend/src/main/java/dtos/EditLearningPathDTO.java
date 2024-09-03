package dtos;

import enums.VisibilityEnum;
import model.Tag;
import model.ViewProgress;

import java.util.List;
import java.util.Set;

public record EditLearningPathDTO(
        Long contentId,
        String title,
        String description,
        Set<Tag> tags,
        VisibilityEnum visibility,
        String color,
        List<LearningPathEntryDTO> entries
) { }
