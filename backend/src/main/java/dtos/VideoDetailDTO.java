package dtos;
import enums.VisibilityEnum;
import model.*;

import java.util.List;

public record VideoDetailDTO(
        Long contentId,
        String title,
        String description,
        List<Tag> tags,
        List<Comment> comments,
        List<Question> questions,
        double rating,
        VideoFile videoFile,
        int viewProgress,
        VisibilityEnum visibility
) { }