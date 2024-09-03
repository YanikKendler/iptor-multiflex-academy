package dtos;

import enums.VisibilityEnum;
import model.*;

import java.util.List;
import java.util.Set;

public record EditVideoDTO(
        Long contentId,
        String title,
        String description,
        String color,
        Set<Tag> tags,
        List<Question> questions,
        VisibilityEnum visibility
) { }
