package dtos;

import enums.VisibilityEnum;
import model.*;

import java.util.List;

public record EditVideoDTO(
        Long contentId,
        String title,
        String description,
        String color,
        List<Tag> tags,
        List<Question> questions,
        VideoFile videoFile,
        VisibilityEnum visibility
) { }
