package dtos;

import enums.VisibilityEnum;
import model.Question;
import model.Tag;
import model.VideoFile;

import java.util.List;

public record CreateVideoDTO(
        String title,
        String description,
        String color,
        List<Tag> tags,
        List<Question> questions,
        VisibilityEnum visibility,
        VideoFile videoFile
) { }
