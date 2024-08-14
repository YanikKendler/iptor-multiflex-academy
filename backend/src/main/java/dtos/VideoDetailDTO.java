package dtos;

import enums.VisibilityEnum;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import model.*;

import java.util.List;

public record VideoDetailDTO(
        Long videoId,
        String title,
        String description,
        List<Tag> tags,
        List<Comment> comments,
        List<Question> questions,
        double rating,
        VideoFile videoFile,
        int viewProgress)
{ }