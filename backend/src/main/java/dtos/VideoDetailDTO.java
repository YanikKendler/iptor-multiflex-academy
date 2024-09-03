package dtos;
import enums.VisibilityEnum;
import model.*;

import java.util.List;
import java.util.Set;

public record VideoDetailDTO(
        Long contentId,
        String title,
        String description,
        String color,
        Set<Tag> tags,
        List<Comment> comments,
        List<Question> questions,
        double rating,
        VideoFile videoFile,
        int viewProgress,
        VisibilityEnum visibility,
        Long userId,
        boolean approved
) { }