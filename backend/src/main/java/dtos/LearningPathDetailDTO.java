package dtos;

import enums.VisibilityEnum;
import model.*;

import java.util.List;

public record LearningPathDetailDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        ViewProgress viewProgress,
        VisibilityEnum visibility,
        String color,
        List<LearningPathEntryDTO> entries,
        Long userId
) {
}
