package dtos;

import enums.VisibilityEnum;
import model.*;

import java.util.List;
import java.util.Set;

public record LearningPathDetailDTO(
        Long contentId,
        String title,
        String description,
        Set<Tag> tags,
        ViewProgress viewProgress,
        VisibilityEnum visibility,
        String color,
        List<LearningPathEntryDTO> entries
) {
}
